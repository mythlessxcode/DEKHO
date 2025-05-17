import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import { fetchPopularMovies, fetchGenres, searchMovies, fetchMoviesByGenre } from "../api/tmdb";
import MovieGrid from "../components/MovieGrid";
import Header from "../components/Header";
import FilterBar from "../components/Filters/FilterBar";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("Popular Movies");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch genres only once
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let moviesData;
        
        if (searchQuery) {
          moviesData = await searchMovies(searchQuery);
          setTitle(`Search Results: "${searchQuery}"`);
        } else if (selectedGenre) {
          moviesData = await fetchMoviesByGenre(selectedGenre);
          const genreName = genres.find(g => g.id === parseInt(selectedGenre))?.name || "";
          setTitle(`${genreName} Movies`);
        } else {
          moviesData = await fetchPopularMovies();
          setTitle("Popular Movies");
        }
        
        // Filter by rating if needed
        if (minRating > 0) {
          moviesData = moviesData.filter(movie => movie.vote_average >= minRating);
        }
        
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre, minRating, searchQuery, genres]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre("");
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setSearchQuery("");
  };

  const handleRatingChange = (event, newValue) => {
    setMinRating(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Header onSearch={handleSearch} />
      
      <Box sx={{ mt: 4 }}>
        <FilterBar 
          genres={genres} 
          selectedGenre={selectedGenre} 
          minRating={minRating}
          onGenreChange={handleGenreChange}
          onRatingChange={handleRatingChange}
        />
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          {title}
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <Box textAlign="center" my={4}>
            <Typography variant="h6">No movies found</Typography>
            <Typography variant="body1">Try adjusting your search or filters</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
