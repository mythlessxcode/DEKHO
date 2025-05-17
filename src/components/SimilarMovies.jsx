import React from "react";
import { Typography, Box, Grid, Card, CardMedia, CardContent, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SimilarMovies({ movies }) {
  const navigate = useNavigate();
  const theme = useTheme();

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        You Might Also Like
      </Typography>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={6} sm={4} md={3} lg={3}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onClick={() => {
                navigate(`/movie/${movie.id}`);
                window.scrollTo(0, 0);
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={movie.title}
              />
              <CardContent sx={{ p: 1 }}>
                <Typography variant="body1" component="div" noWrap fontWeight="bold">
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {movie.vote_average.toFixed(1)}/10
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}