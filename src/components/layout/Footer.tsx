import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} CareerFlow. Todos os direitos reservados.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Desenvolvido para organizar sua carreira profissional
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Link href="#" color="inherit" underline="hover">
            Termos de Uso
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Política de Privacidade
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Contato
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;