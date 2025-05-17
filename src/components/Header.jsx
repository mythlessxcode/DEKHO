import { useState } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, IconButton } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../context/ThemeContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Header({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useColorMode();
  
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchValue);
    }
  };
  
  return (
    <AppBar position="static" sx={{ borderRadius: 1, mb: 2 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="home"
          sx={{ mr: 2 }}
          onClick={() => navigate('/')}
        >
          <HomeIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          DEKHO
        </Typography>
        
        <IconButton 
          sx={{ ml: 1, mr: 2 }} 
          onClick={colorMode.toggleColorMode} 
          color="inherit"
          aria-label="toggle dark mode"
        >
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
          />
        </Search>
      </Toolbar>
    </AppBar>
  );
}
