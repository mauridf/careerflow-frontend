import { Container, Typography, Box } from '@mui/material';

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Página de Login
        </Typography>
        <Typography>
          Formulário de login será implementado aqui
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;