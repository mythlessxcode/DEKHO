import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  CircularProgress,
  Box,
  Button,
  Paper,
  useTheme,
  Grid,
  Chip,
  Rating,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchMovieDetails, fetchSimilarMovies, fetchMovieCredits } from "../api/tmdb";
import SimilarMovies from "../components/SimilarMovies";
import MovieCast from "../components/MovieCast";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const [movieData, similarData, creditsData] = await Promise.all([
          fetchMovieDetails(id),
          fetchSimilarMovies(id),
          fetchMovieCredits(id)
        ]);
        
        setMovie(movieData);
        setSimilarMovies(similarData);
        setCredits(creditsData);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h5">Movie not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <IconButton 
        onClick={() => navigate("/")} 
        sx={{ mb: 2 }}
        aria-label="back to home"
      >
        <ArrowBackIcon />
      </IconButton>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 4 }, 
          borderRadius: 2,
          backgroundImage: movie.backdrop_path 
            ? `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: movie.backdrop_path ? 'white' : 'inherit',
          mb: 4
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'
              }
              alt={movie.title}
              sx={{ 
                width: '100%',
                borderRadius: 2,
                boxShadow: theme.shadows[8]
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {movie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating 
                value={movie.vote_average / 2} 
                precision={0.5} 
                readOnly 
              />
              <Typography variant="h6" sx={{ ml: 1 }}>
                {movie.vote_average.toFixed(1)}/10
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              {movie.release_date} • {movie.runtime} min
            </Typography>
            
            <Box sx={{ my: 2 }}>
              {movie.genres && movie.genres.map((genre) => (
                <Chip 
                  key={genre.id} 
                  label={genre.name} 
                  sx={{ mr: 1, mb: 1 }} 
                />
              ))}
            </Box>
            
            <Typography variant="body1" mb={2}>{movie.overview}</Typography>
            
            {movie.tagline && (
              <Typography 
                variant="subtitle1" 
                fontStyle="italic" 
                color="text.secondary"
                sx={{ mt: 2, opacity: 0.8 }}
              >
                "{movie.tagline}"
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <MovieCast cast={credits.cast} />
      
      <Divider sx={{ my: 4 }} />
      
      <SimilarMovies movies={similarMovies} />
    </Container>
  );
}
