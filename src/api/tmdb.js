const API_KEY = "55db4dc063a189df87f29bc1c93156d3";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

export const fetchGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return [];
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

export const fetchSimilarMovies = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results.slice(0, 8); // Limit to 8 similar movies
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return [];
  }
};

export const fetchMovieCredits = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return { cast: [], crew: [] };
  }
};
