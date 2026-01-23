import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          404 - Página não encontrada
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          A página que você está procurando não existe ou foi movida.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          Voltar para a página inicial
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;