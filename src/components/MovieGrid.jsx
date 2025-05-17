import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MovieGrid({ movies }) {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.03)'
              }
            }}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <CardMedia
              component="img"
              height="300"
              image={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
              }
              alt={movie.title}
            />
            <CardContent>
              <Typography variant="h6" component="div" noWrap>
                {movie.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2">
                  Rating: {movie.vote_average.toFixed(1)}/10
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
