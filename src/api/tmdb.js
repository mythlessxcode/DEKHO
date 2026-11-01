const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = (import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3").replace(
  /\/$/,
  ""
);
const REQUEST_TIMEOUT_MS = 10_000;

if (!API_KEY) {
  throw new Error(
    "Missing VITE_TMDB_API_KEY. Add it to your .env file and restart the Vite dev server."
  );
}

export class TmdbError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
    this.code = code;
  }
}

async function tmdbFetch(path, params = {}, { signal } = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new TmdbError(data?.status_message ?? `TMDB request failed (${response.status})`, {
        status: response.status,
        code: data?.status_code,
      });
    }

    return data;
  } catch (error) {
    if (error instanceof TmdbError) throw error;

    if (error.name === "AbortError") {
      if (signal?.aborted) throw error;
      throw new TmdbError("TMDB request timed out", { status: 408 });
    }

    throw new TmdbError(error.message || "Network error talking to TMDB");
  } finally {
    clearTimeout(timeoutId);
  }
}

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export function tmdbImage(path, size = "w500") {
  if (!path) return "";
  return `${IMAGE_BASE}/${size}${path}`;
}

export const fetchPopularMovies = async (options) => {
  const data = await tmdbFetch("/movie/popular", {}, options);
  return data.results ?? [];
};

export const fetchGenres = async (options) => {
  const data = await tmdbFetch("/genre/movie/list", {}, options);
  return data.genres ?? [];
};

export const searchMovies = async (query, options) => {
  const trimmed = query?.trim();
  if (!trimmed) return [];

  const data = await tmdbFetch("/search/movie", { query: trimmed }, options);
  return data.results ?? [];
};

export const fetchMoviesByGenre = async (genreId, options) => {
  const data = await tmdbFetch("/discover/movie", { with_genres: genreId }, options);
  return data.results ?? [];
};

export const fetchMovieDetails = async (id, options) => {
  return tmdbFetch(`/movie/${id}`, {}, options);
};

export const fetchSimilarMovies = async (id, options) => {
  const data = await tmdbFetch(`/movie/${id}/similar`, {}, options);
  return (data.results ?? []).slice(0, 8);
};

export const fetchMovieCredits = async (id, options) => {
  const data = await tmdbFetch(`/movie/${id}/credits`, {}, options);
  return {
    cast: data.cast ?? [],
    crew: data.crew ?? [],
  };
};
