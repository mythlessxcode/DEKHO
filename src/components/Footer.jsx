import { Box, Container, Typography, Link, Divider } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, mt: 'auto', bgcolor: 'primary.main', color: 'white' }}>
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-start' } }}>
          <Box sx={{ mb: { xs: 2, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" gutterBottom>
              DEKHO
            </Typography>
            <Typography variant="body2">
              A simple movie browsing application
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Data provided by <Link href="https://www.themoviedb.org/" target="_blank" rel="noopener" color="inherit" sx={{ textDecoration: 'underline' }}>
                TMDb
              </Link>
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} DEKHO
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Built with React, Material UI, and Vite
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}