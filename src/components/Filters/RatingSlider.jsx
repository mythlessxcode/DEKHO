import { Box, Slider, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function RatingSlider({ minRating, onChange }) {
  return (
    <Box sx={{ width: 200 }}>
      <Typography id="rating-slider" gutterBottom display="flex" alignItems="center">
        Min Rating <StarIcon sx={{ color: 'gold', ml: 0.5, fontSize: 18 }} />
      </Typography>
      <Slider
        value={minRating}
        onChange={onChange}
        aria-labelledby="rating-slider"
        valueLabelDisplay="auto"
        step={0.5}
        marks
        min={0}
        max={10}
        sx={{
          color: 'gold',
          '& .MuiSlider-thumb': {
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0px 0px 0px 8px rgba(255, 215, 0, 0.16)',
            },
          },
        }}
      />
    </Box>
  );
}
