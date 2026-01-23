import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/images/Logo.png';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* Logo */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            mr: 3 
          }}
          onClick={() => navigate('/')}
        >
          <img 
            src={logo} 
            alt="CareerFlow Logo" 
            style={{ height: '40px', marginRight: '12px' }} 
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            CareerFlow
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Menu de Navegação */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: 'primary.light'
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="body2">
                {user?.name}
              </Typography>
            </Box>
            
            <Button 
              color="inherit" 
              variant="outlined" 
              size="small"
              onClick={logout}
              sx={{ ml: 2 }}
            >
              Sair
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
            >
              Entrar
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/register')}
            >
              Cadastrar
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;