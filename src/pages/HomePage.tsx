import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Bem-vindo ao CareerFlow
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Organize, analise e planeje sua carreira profissional
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ mr: 2 }}
          >
            Entrar
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
          >
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;