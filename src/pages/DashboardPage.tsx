import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';

interface Stats {
  experiences: number;
  educations: number;
  skills: number;
  certificates: number;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    experiences: 0,
    educations: 0,
    skills: 0,
    certificates: 0
  });

  // Usando useEffect com setTimeout para evitar chamada síncrona
  useEffect(() => {
    if (user) {
      // Usando setTimeout para evitar chamada síncrona dentro do effect
      const timer = setTimeout(() => {
        setStats({
          experiences: 2,
          educations: 1,
          skills: 8,
          certificates: 3
        });
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (isLoading || !user) {
    return <Loading fullScreen message="Carregando dashboard..." />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Container maxWidth="lg">
      {/* Cabeçalho do Dashboard */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bem-vindo de volta, {user.name}! Aqui está um resumo da sua carreira.
        </Typography>
      </Box>

      {/* Estatísticas usando Box em vez de Grid */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
        justifyContent: { xs: 'center', sm: 'space-between' }
      }}>
        {/* Card Experiências */}
        <Card sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <WorkIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" component="div">
              {stats.experiences}
            </Typography>
            <Typography color="text.secondary">
              Experiências
            </Typography>
          </CardContent>
        </Card>
        
        {/* Card Formações */}
        <Card sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" component="div">
              {stats.educations}
            </Typography>
            <Typography color="text.secondary">
              Formações
            </Typography>
          </CardContent>
        </Card>
        
        {/* Card Habilidades */}
        <Card sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <CodeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" component="div">
              {stats.skills}
            </Typography>
            <Typography color="text.secondary">
              Habilidades
            </Typography>
          </CardContent>
        </Card>
        
        {/* Card Certificados */}
        <Card sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" component="div">
              {stats.certificates}
            </Typography>
            <Typography color="text.secondary">
              Certificados
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Conteúdo principal usando Box em vez de Grid */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Perfil do usuário */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" component="h2">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Membro desde {formatDate(user.createdAt)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={user.email} />
              </ListItem>
              
              {user.phone && (
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary="Telefone" secondary={user.phone} />
                </ListItem>
              )}
              
              <ListItem>
                <ListItemIcon>
                  <LocationCityIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Localização" 
                  secondary={`${user.city}, ${user.state}`} 
                />
              </ListItem>
            </List>

            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => navigate('/profile')}
            >
              Editar Perfil
            </Button>
          </Paper>
        </Box>

        {/* Ações rápidas */}
        <Box sx={{ flex: 2 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Ações Rápidas
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Complete seu perfil profissional para gerar um currículo ATS otimizado.
            </Typography>

            {/* Cards de ações usando Box */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mt: 2 
            }}>
              {/* Card Experiências */}
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: '1 1 calc(50% - 16px)', 
                  minWidth: '250px',
                  cursor: 'pointer', 
                  '&:hover': { borderColor: 'primary.main' } 
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Experiências</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Adicione suas experiências profissionais
                  </Typography>
                </CardContent>
              </Card>
              
              {/* Card Formação */}
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: '1 1 calc(50% - 16px)', 
                  minWidth: '250px',
                  cursor: 'pointer', 
                  '&:hover': { borderColor: 'primary.main' } 
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Formação</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Adicione sua formação acadêmica
                  </Typography>
                </CardContent>
              </Card>
              
              {/* Card Habilidades */}
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: '1 1 calc(50% - 16px)', 
                  minWidth: '250px',
                  cursor: 'pointer', 
                  '&:hover': { borderColor: 'primary.main' } 
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CodeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Habilidades</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Adicione suas habilidades técnicas
                  </Typography>
                </CardContent>
              </Card>
              
              {/* Card Certificados */}
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: '1 1 calc(50% - 16px)', 
                  minWidth: '250px',
                  cursor: 'pointer', 
                  '&:hover': { borderColor: 'primary.main' } 
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Certificados</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Adicione suas certificações
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/cv-generator')}
              >
                Gerar Currículo ATS
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;