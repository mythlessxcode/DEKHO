import React from "react";
import { Typography, Box, Grid, Card, CardMedia, CardContent, Avatar } from "@mui/material";

export default function MovieCast({ cast }) {
  if (!cast || cast.length === 0) {
    return null;
  }

  // Limit to top 8 cast members
  const topCast = cast.slice(0, 8);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Cast
      </Typography>
      <Grid container spacing={2}>
        {topCast.map((person) => (
          <Grid item key={person.id} xs={6} sm={4} md={3} lg={3}>
            <Card sx={{ height: '100%' }}>
              {person.profile_path ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 200, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'grey.200' 
                  }}
                >
                  <Avatar 
                    sx={{ width: 80, height: 80 }}
                    alt={person.name}
                  >
                    {person.name.charAt(0)}
                  </Avatar>
                </Box>
              )}
              <CardContent>
                <Typography variant="body1" component="div" fontWeight="bold">
                  {person.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {person.character}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}