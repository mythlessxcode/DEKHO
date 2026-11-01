import { ArrowUpDown, Grid2X2, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { fetchGenres, fetchMoviesByGenre, fetchPopularMovies, searchMovies } from "@/api/tmdb";
import { CardGrid, ClearFilters, ListingHead, Toolbar } from "@/components/listing";
import { MoviePosterCard } from "@/components/movie-poster-card";
import { PageShell } from "@/components/page-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Highlight } from "@/components/ui/highlight";
import { iconButtonVariants } from "@/components/ui/icon-button";
import { inputClass } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const RATING_OPTIONS = [
  { value: "0", label: "All" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
];

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [genreId, setGenreId] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");

  useEffect(() => {
    fetchGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const load = submitted
      ? searchMovies(submitted, { signal: controller.signal })
      : genreId
        ? fetchMoviesByGenre(genreId, { signal: controller.signal })
        : fetchPopularMovies({ signal: controller.signal });

    load
      .then((results) => setMovies(results ?? []))
      .catch((error) => {
        if (error.name !== "AbortError" && error.status !== 408) setMovies([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [submitted, genreId]);

  const genreMap = useMemo(() => Object.fromEntries(genres.map((g) => [g.id, g.name])), [genres]);

  const visible = useMemo(() => {
    const floor = Number(minRating);
    let next = movies.filter((m) => (m.vote_average ?? 0) >= floor);
    if (sort === "rating") next = [...next].sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
    if (sort === "a-z") next = [...next].sort((a, b) => a.title.localeCompare(b.title));
    return next;
  }, [movies, minRating, sort]);

  const filtersOn = Boolean(submitted || genreId || minRating !== "0");

  const onSearchKey = (event) => {
    if (event.key === "Enter") {
      setSubmitted(query.trim());
      setGenreId("");
    }
  };

  return (
    <PageShell>
      <ListingHead title="Movies">
        Posters, plots and <Highlight>ratings out of ten</Highlight>, so you can sort the night by score.
      </ListingHead>

      <Toolbar
        count={visible.length}
        noun="movies"
        aside={submitted ? `Search: ${submitted}` : "Popular and filtered"}
        filters={
          <>
            <label className="sr-only" htmlFor="genre">
              Genre
            </label>
            <select
              id="genre"
              value={genreId}
              onChange={(event) => {
                setGenreId(event.target.value);
                setSubmitted("");
                setQuery("");
              }}
              className={cn(inputClass, "w-auto min-w-40")}
            >
              <option value="">All genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            <ClearFilters
              active={filtersOn}
              onClear={() => {
                setQuery("");
                setSubmitted("");
                setGenreId("");
                setMinRating("0");
              }}
            />
          </>
        }
      >
        <SearchInput
          aria-label="Search movies"
          placeholder="Search…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onSearchKey}
        />
        <Segmented label="Minimum rating" value={minRating} onChange={setMinRating} options={RATING_OPTIONS} />
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Sort movies" className={iconButtonVariants()}>
            <ArrowUpDown className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="rating">Highest rated</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="a-z">A to Z</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Segmented
          label="Layout"
          value={view}
          onChange={setView}
          options={[
            { value: "grid", label: <Grid2X2 aria-hidden="true" />, "aria-label": "Grid view" },
            { value: "list", label: <List aria-hidden="true" />, "aria-label": "List view" },
          ]}
        />
      </Toolbar>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Spinner label="Loading movies" className="[&_svg]:size-6" />
        </div>
      ) : visible.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No movies match those filters. Try clearing them.</p>
      ) : view === "grid" ? (
        <CardGrid className="mt-2">
          {visible.map((movie) => (
            <MoviePosterCard
              key={movie.id}
              movie={movie}
              genreName={movie.genre_ids?.map((id) => genreMap[id]).find(Boolean)}
            />
          ))}
        </CardGrid>
      ) : (
        <div className="mt-2 grid gap-6">
          {visible.map((movie) => (
            <MoviePosterCard
              key={movie.id}
              movie={movie}
              layout="list"
              genreName={movie.genre_ids?.map((id) => genreMap[id]).find(Boolean)}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
