import { Container, Typography, Box } from '@mui/material';

const RegisterPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Página de Registro
        </Typography>
        <Typography>
          Formulário de registro será implementado aqui
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;