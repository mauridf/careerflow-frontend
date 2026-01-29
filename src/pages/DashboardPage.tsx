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
  ListItemText,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import { profileService } from '../api/profileService';
import ResumeModal from '../components/ResumeModal'; 
import type { DashboardStats, DashboardSkillDistribution } from '../types';
import { skillsService } from '../api/skillsService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [skillDistribution, setSkillDistribution] = useState<DashboardSkillDistribution[]>([]);

  useEffect(() => {
  const loadDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [statsData, distributionData] = await Promise.all([
        profileService.getDashboardStats(),
        skillsService.getSkillDistribution(),
      ]);
      setStats(statsData);
      setSkillDistribution(distributionData);
    } catch (err: unknown) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Não foi possível carregar os dados do dashboard. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  loadDashboardData();
  // Remova loadSkills da dependência - useEffect depende apenas de user
  }, [user]);

  if (authLoading) {
    return <Loading fullScreen message="Verificando autenticação..." />;
  }

  if (!user) {
    return <Loading fullScreen message="Redirecionando para login..." />;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGenerateATS = () => {
    setResumeModalOpen(false);
    // Lógica para gerar CV ATS
    alert('Funcionalidade de gerar CV ATS será implementada em breve!');
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

      {/* Exibir erro se houver */}
      {error && (
        <ErrorMessage 
          message={error}
          onRetry={handleRetry}
          fullWidth
        />
      )}

      {/* Progresso do perfil */}
      {stats && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Completude do Perfil
              </Typography>
              <Typography variant="h6" color="primary">
                {stats.profileCompleteness}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={stats.profileCompleteness} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Complete mais informações para melhorar seu perfil profissional
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Loading message="Carregando estatísticas..." />
        </Box>
      ) : stats ? (
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
                {stats.totalExperiences}
              </Typography>
              <Typography color="text.secondary">
                Experiências
              </Typography>
            </CardContent>
          </Card>
          
          {/* Card Habilidades */}
          <Card sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CodeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.totalSkills}
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
                {stats.totalCertificates}
              </Typography>
              <Typography color="text.secondary">
                Certificados
              </Typography>
            </CardContent>
          </Card>
          
          {/* Card Idiomas */}
          <Card sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LanguageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.totalLanguages}
              </Typography>
              <Typography color="text.secondary">
                Idiomas
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ) : null}

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
              startIcon={<PersonIcon />}
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
                onClick={() => navigate('/profile?section=experiences')}
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
              
              {/* Card Habilidades */}
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: '1 1 calc(50% - 16px)', 
                  minWidth: '250px',
                  cursor: 'pointer', 
                  '&:hover': { borderColor: 'primary.main' } 
                }}
                onClick={() => navigate('/skills')}
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
                onClick={() => navigate('/profile?section=certificates')}
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
              
              {/* Card Idiomas */}
              <Card 
                variant="outlined" 
                sx={{ 
                  flex: '1 1 calc(50% - 16px)', 
                  minWidth: '250px',
                  cursor: 'pointer', 
                  '&:hover': { borderColor: 'primary.main' } 
                }}
                onClick={() => navigate('/profile?section=languages')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LanguageIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Idiomas</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Adicione seus conhecimentos de idiomas
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => setResumeModalOpen(true)}
                sx={{ px: 4 }}
              >
                Gerar Currículo ATS
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Distribuição de habilidades */}
      {skillDistribution.length > 0 ? (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Distribuição de Habilidades
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {skillDistribution.map((item, index) => (
              <Card key={index} variant="outlined" sx={{ flex: '1 1 calc(33% - 16px)', minWidth: '200px' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.type}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {item.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.percentage}% do total
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      ) : null}

      {/* Modal de Resumo CV */}
      <ResumeModal
        open={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        onGenerateATS={handleGenerateATS}
      />
    </Container>
  );
};

export default DashboardPage;