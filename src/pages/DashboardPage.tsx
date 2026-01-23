import { Container, Typography, Box } from '@mui/material';

const DashboardPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography>
          Dashboard do usuário será implementado aqui
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardPage;