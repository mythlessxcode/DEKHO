import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, tmdbImage } from "@/api/tmdb";
import { PageShell } from "@/components/page-shell";
import { MoviePosterCard } from "@/components/movie-poster-card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Highlight } from "@/components/ui/highlight";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardMedia } from "@/components/ui/card";
import { SectionHead } from "@/components/section-head";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([fetchMovieDetails(id), fetchSimilarMovies(id), fetchMovieCredits(id)])
      .then(([movieData, similarData, creditsData]) => {
        if (!alive) return;
        setMovie(movieData);
        setSimilar(similarData);
        setCredits(creditsData);
      })
      .catch(() => {
        if (alive) setMovie(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner label="Loading movie" className="[&_svg]:size-6" />
        </div>
      </PageShell>
    );
  }

  if (!movie?.title) {
    return (
      <PageShell>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-medium">Movie not found</h1>
          <Button className="mt-4" variant="solid" onClick={() => navigate("/movies")}>
            Back to movies
          </Button>
        </div>
      </PageShell>
    );
  }

  const rating = Number(movie.vote_average ?? 0);
  const poster = tmdbImage(movie.poster_path, "w500");
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const topCast = (credits.cast ?? []).slice(0, 8);

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-brand">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link to="/movies" className="transition-colors hover:text-brand">
          Movies
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{movie.title}</span>
      </nav>

      <section className="mt-6 grid gap-8 md:grid-cols-[minmax(0,280px)_1fr]">
        <Card className="overflow-hidden sm:opacity-100">
          <CardMedia className="aspect-[2/3]">
            {poster ? <img src={poster} alt="" /> : <Skeleton className="size-full" />}
          </CardMedia>
        </Card>

        <div>
          <p className="font-montserrat text-4xl font-semibold tabular-nums sm:text-5xl">{rating.toFixed(1)}</p>
          <p className="mt-1 text-sm text-muted-foreground">TMDb rating out of 10</p>
          <h1 className="mt-4 text-2xl font-medium sm:text-3xl">{movie.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-neutral-700 dark:text-neutral-400">
            {movie.overview || "No plot is listed for this title."}{" "}
            {movie.tagline ? <Highlight>{movie.tagline.replace(/[—–]/g, ",")}</Highlight> : null}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Chip>{year}</Chip>
            {movie.runtime ? <Chip>{movie.runtime} min</Chip> : null}
            {(movie.genres ?? []).map((genre) => (
              <Chip key={genre.id}>{genre.name}</Chip>
            ))}
          </div>
          <Button className="mt-6" variant="outline" onClick={() => navigate("/movies")}>
            Back to movies
          </Button>
        </div>
      </section>

      {topCast.length > 0 && (
        <section className="mt-16" aria-labelledby="cast-head">
          <SectionHead id="cast-head" title="Cast">
            Faces behind the <Highlight>main roles</Highlight>.
          </SectionHead>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {topCast.map((person) => (
              <article key={person.cast_id ?? person.id} className="card-chai overflow-hidden sm:opacity-90 sm:hover:opacity-100">
                {person.profile_path ? (
                  <img
                    src={tmdbImage(person.profile_path, "w185")}
                    alt=""
                    className="aspect-[3/4] w-full object-cover transition-transform duration-300 motion-safe:hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center bg-muted text-2xl">{person.name.charAt(0)}</div>
                )}
                <div className="p-3">
                  <p className="font-montserrat text-sm font-semibold">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.character}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-16 mb-8" aria-labelledby="similar-head">
          <SectionHead id="similar-head" title="You might also like">
            Nearby titles, still with <Highlight>ratings in view</Highlight>.
          </SectionHead>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.slice(0, 6).map((item) => (
              <MoviePosterCard key={item.id} movie={item} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
