import { useEffect, useState } from "react";
import { Search, Star, Telescope } from "lucide-react";

import { fetchPopularMovies, tmdbImage } from "@/api/tmdb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CardSwap, CardSwapItem } from "@/components/card-swap";
import { Carousel } from "@/components/carousel";
import { CtaPanel } from "@/components/cta-panel";
import { FeatureBento } from "@/components/feature-bento";
import { Hero } from "@/components/hero";
import { MoviePosterCard } from "@/components/movie-poster-card";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { RotatingWord } from "@/components/rotating-word";
import { SectionHead } from "@/components/section-head";
import { ShinyText } from "@/components/shiny-text";
import { StatStrip } from "@/components/stat-strip";
import { Highlight } from "@/components/ui/highlight";
import { Skeleton } from "@/components/ui/skeleton";

const FEATURES = [
  { title: "Clear ratings", description: "Every title shows its TMDb score up front, so you pick with numbers, not noise.", tone: "blue", link: { label: "Browse movies", href: "/movies" } },
  { title: "Honest filters", description: "Search, genre and a rating floor. No tricks in the list.", tone: "purple" },
  { title: "Quiet design", description: "Dark by default, hairline cards, motion that stays out of the way.", tone: "amber" },
  { title: "Story first", description: "Read the plot, the cast and similar films before you commit an evening.", tone: "grey", link: { label: "See a film", href: "/movies" } },
  { title: "Open data", description: "Titles, posters and scores come from The Movie Database.", tone: "amber" },
  { title: "Fast find", description: "Type a name, hit enter, land on the right poster.", tone: "blue" },
  { title: "Free to browse", description: "No account. Open the site and start looking.", tone: "purple" },
];

const FAQS = [
  {
    q: "What is DEKHO?",
    a: "DEKHO is a movie browser. It helps you find films, read a short description and see ratings before you pick one.",
  },
  {
    q: "Where do the ratings come from?",
    a: "Scores are TMDb community ratings out of 10. We show them on every card so you can sort and filter by them.",
  },
  {
    q: "Is this a streaming app?",
    a: "No. DEKHO is for discovery. It does not play films. It points you toward what is worth your time.",
  },
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchPopularMovies()
      .then((results) => {
        if (alive) setMovies(results.slice(0, 12));
      })
      .catch(() => {
        if (alive) setMovies([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const swapMovies = movies.filter((m) => m.backdrop_path).slice(0, 3);

  return (
    <PageShell>
      <Hero
        badge="A calmer way to pick a film"
        title={
          <>
            Watch{" "}
            <RotatingWord words={["stories", "nights", "ratings"]} /> that stay
          </>
        }
        primary={{ label: "Browse movies", href: "/movies" }}
        secondary={{ label: "How it works", href: "#about" }}
        media={
          loading || swapMovies.length < 2 ? (
            <Skeleton className="aspect-video w-full rounded-2xl" />
          ) : (
            <div className="flex min-h-[220px] items-center justify-center py-6">
              <CardSwap width={280} height={168} delay={4200} className="max-w-full">
                {swapMovies.map((movie) => (
                  <CardSwapItem key={movie.id}>
                    <img
                      src={tmdbImage(movie.backdrop_path, "w780")}
                      alt=""
                      className="size-full object-cover"
                    />
                  </CardSwapItem>
                ))}
              </CardSwap>
            </div>
          )
        }
      >
        DEKHO is a movie browser for people who want a short brief, a poster and a score, then{" "}
        <Highlight>a clear choice</Highlight> for the night.
      </Hero>

      <Reveal>
        <StatStrip
          className="mt-16 sm:mt-20"
          stats={[
            { value: `${movies.length || "20"}+`, label: "Films on the board" },
            { value: "10", label: "Point rating scale" },
            { value: "TMDb", label: "Open movie data" },
            { value: "0", label: "Accounts to create" },
          ]}
        />
      </Reveal>

      <p className="mt-10 text-center text-lg sm:text-xl">
        <ShinyText>Built for people who pick films with care</ShinyText>
      </p>

      <Reveal>
        <section id="about" aria-labelledby="about-head" className="mt-16 scroll-mt-24 sm:mt-20">
          <SectionHead id="about-head" title="What DEKHO is">
            A small site with one job: help you <Highlight>see a film clearly</Highlight> before you spend the evening.
          </SectionHead>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, title: "Find", text: "Search by name or walk the popular list. Filters stay honest." },
              { icon: Star, title: "Rate", text: "TMDb scores sit on every card, so high and low are obvious." },
              { icon: Telescope, title: "Decide", text: "Open a title for plot, runtime, cast and similar films." },
            ].map((item) => (
              <article key={item.title} className="card-chai p-5 sm:opacity-90 sm:hover:opacity-100">
                <item.icon className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="mt-4 font-montserrat text-base font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="why-head" className="mt-20 md:mt-24">
          <SectionHead id="why-head" title="Why this site">
            Most lists shout. DEKHO keeps the page quiet so the{" "}
            <Highlight>rating can speak</Highlight>.
          </SectionHead>
          <FeatureBento features={FEATURES} />
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="trending-head" className="mt-16 sm:mt-20">
          <SectionHead id="trending-head" title="On the board" action={{ label: "View all", href: "/movies" }}>
            A rotating look at what people are watching, with{" "}
            <Highlight>scores on every poster</Highlight>.
          </SectionHead>
          {loading ? (
            <div className="mt-6 flex gap-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-[220px] shrink-0 rounded-xl" />
              ))}
            </div>
          ) : (
            <Carousel label="Popular movies">
              {movies.map((movie) => (
                <div key={movie.id} className="w-[220px]">
                  <MoviePosterCard movie={movie} />
                </div>
              ))}
            </Carousel>
          )}
        </section>
      </Reveal>

      <Reveal>
        <section id="faq" aria-labelledby="faq-head" className="mt-20 scroll-mt-24 md:mt-24">
          <SectionHead id="faq-head" title="Questions">
            Short answers, <Highlight>no extra noise</Highlight>.
          </SectionHead>
          <Accordion type="single" collapsible className="mt-6">
            {FAQS.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </Reveal>

      <CtaPanel
        className="mt-20 mb-8 md:mt-24"
        heading="Ready to pick tonight's film?"
        tagline="Open the movies page, sort by rating, and take the one that earns it."
        action={{ label: "Go to movies", href: "/movies" }}
      />
    </PageShell>
  );
}
