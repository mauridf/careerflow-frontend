import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.png'; // Importando a logo

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        my: 4, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh'
      }}>
        {/* Logo */}
        <Box sx={{ mb: 4 }}>
          <img 
            src={logo} 
            alt="CareerFlow Logo" 
            style={{ 
              height: '80px',
              width: 'auto',
              marginBottom: '16px'
            }} 
          />
        </Box>
        
        {/* Título e subtítulo */}
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          CareerFlow
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
          Organize, analise e planeje sua carreira profissional de forma inteligente
        </Typography>
        
        {/* Botões de ação */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 4, py: 1.5 }}
          >
            Entrar
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ px: 4, py: 1.5 }}
          >
            Cadastrar
          </Button>
        </Box>

        {/* Recursos destacados */}
        <Box sx={{ mt: 8, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
            <Typography variant="h6" gutterBottom>📊 Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              Visualize todos os seus dados profissionais em um só lugar
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
            <Typography variant="h6" gutterBottom>📝 CV ATS</Typography>
            <Typography variant="body2" color="text.secondary">
              Gere currículos otimizados para sistemas de triagem automática
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
            <Typography variant="h6" gutterBottom>🔔 Lembretes</Typography>
            <Typography variant="body2" color="text.secondary">
            Receba alertas para atualizações e prazos importantes
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;