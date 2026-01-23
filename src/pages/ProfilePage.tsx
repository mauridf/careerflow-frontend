import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import { profileService } from '../api/profileService';
import type { Summary, SocialMedia } from '../types';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  // Estados para Summary
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryText, setSummaryText] = useState('');
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isSavingSummary, setIsSavingSummary] = useState(false);

  // Estados para Social Medias
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [newSocialMedia, setNewSocialMedia] = useState({ platform: '', url: '' });
  const [isAddingSocialMedia, setIsAddingSocialMedia] = useState(false);

  // Estados gerais
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estado para modal de confirmação
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'summary' | 'social-media';
    id?: string;
  }>({ open: false, type: 'summary' });

  // Carregar dados do perfil
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // Carregar summary
        try {
          const summaryData = await profileService.getSummary();
          setSummary(summaryData);
          setSummaryText(summaryData.summary);
        } catch (err) {
          // Summary pode não existir ainda
          console.log('Summary não encontrado, criando novo...');
        }

        // Carregar social medias
        const socialMediasData = await profileService.getSocialMedias();
        setSocialMedias(socialMediasData);
      } catch (err: any) {
        console.error('Erro ao carregar dados do perfil:', err);
        setError('Não foi possível carregar os dados do perfil. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  // Funções para Summary
  const handleSaveSummary = async () => {
    if (!summaryText.trim()) {
      setError('Por favor, insira um resumo profissional.');
      return;
    }

    setIsSavingSummary(true);
    setError(null);

    try {
      const summaryData = await profileService.createSummary({ summary: summaryText });
      setSummary(summaryData);
      setIsEditingSummary(false);
      setSuccessMessage('Resumo profissional salvo com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar resumo:', err);
      setError('Não foi possível salvar o resumo. Tente novamente.');
    } finally {
      setIsSavingSummary(false);
    }
  };

  const handleDeleteSummary = async () => {
    try {
      await profileService.deleteSummary();
      setSummary(null);
      setSummaryText('');
      setDeleteDialog({ open: false, type: 'summary' });
      setSuccessMessage('Resumo profissional excluído com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao excluir resumo:', err);
      setError('Não foi possível excluir o resumo. Tente novamente.');
    }
  };

  // Funções para Social Medias
  const handleAddSocialMedia = async () => {
    if (!newSocialMedia.platform.trim() || !newSocialMedia.url.trim()) {
      setError('Por favor, preencha todos os campos da rede social.');
      return;
    }

    if (!isValidUrl(newSocialMedia.url)) {
      setError('Por favor, insira uma URL válida.');
      return;
    }

    setIsAddingSocialMedia(true);
    setError(null);

    try {
      const socialMediaData = await profileService.createSocialMedia(newSocialMedia);
      setSocialMedias(prev => [...prev, socialMediaData]);
      setNewSocialMedia({ platform: '', url: '' });
      setSuccessMessage('Rede social adicionada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao adicionar rede social:', err);
      setError('Não foi possível adicionar a rede social. Tente novamente.');
    } finally {
      setIsAddingSocialMedia(false);
    }
  };

  const handleDeleteSocialMedia = async (id: string) => {
    try {
      await profileService.deleteSocialMedia(id);
      setSocialMedias(prev => prev.filter(sm => sm.id !== id));
      setDeleteDialog({ open: false, type: 'social-media' });
      setSuccessMessage('Rede social excluída com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro ao excluir rede social:', err);
      setError('Não foi possível excluir a rede social. Tente novamente.');
    }
  };

  // Funções auxiliares
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('linkedin')) return <LinkedInIcon />;
    if (platformLower.includes('github')) return <GitHubIcon />;
    if (platformLower.includes('twitter')) return <TwitterIcon />;
    if (platformLower.includes('facebook')) return <FacebookIcon />;
    if (platformLower.includes('instagram')) return <InstagramIcon />;
    return <LanguageIcon />;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (authLoading) {
    return <Loading fullScreen message="Verificando autenticação..." />;
  }

  if (!user) {
    return <Loading fullScreen message="Redirecionando para login..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Meu Perfil
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie suas informações profissionais
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Voltar ao Dashboard
          </Button>
        </Box>

        {/* Mensagens de sucesso/erro */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <ErrorMessage 
            message={error}
            onRetry={() => window.location.reload()}
            fullWidth
            sx={{ mb: 3 }}
          />
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Loading message="Carregando dados do perfil..." />
          </Box>
        ) : (
          <>
            {/* Informações do Usuário */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Informações Pessoais
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Nome
                    </Typography>
                    <Typography variant="body1">
                      {user.name}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {user.email}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Telefone
                    </Typography>
                    <Typography variant="body1">
                      {user.phone || 'Não informado'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 300px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Localização
                    </Typography>
                    <Typography variant="body1">
                      {user.city}, {user.state}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Resumo Profissional */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Resumo Profissional
                </Typography>
                {summary && !isEditingSummary && (
                  <Box>
                    <IconButton
                      onClick={() => setIsEditingSummary(true)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, type: 'summary' })}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {summary && !isEditingSummary ? (
                <Box>
                  <Typography variant="body1" paragraph>
                    {summary.summary}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Atualizado em: {formatDate(summary.updatedAt)}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {!summary && !isEditingSummary ? (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      Você ainda não possui um resumo profissional cadastrado. 
                      Crie um para destacar suas habilidades e experiências.
                    </Alert>
                  ) : null}

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    placeholder="Descreva suas principais habilidades, experiências e objetivos profissionais. Este resumo será exibido no topo do seu currículo."
                    variant="outlined"
                    sx={{ mb: 2 }}
                    disabled={isSavingSummary}
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveSummary}
                      disabled={isSavingSummary || !summaryText.trim()}
                      startIcon={isSavingSummary ? <CircularProgress size={20} /> : null}
                    >
                      {isSavingSummary ? 'Salvando...' : summary ? 'Atualizar Resumo' : 'Salvar Resumo'}
                    </Button>
                    {isEditingSummary && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setIsEditingSummary(false);
                          if (summary) setSummaryText(summary.summary);
                        }}
                        disabled={isSavingSummary}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Redes Sociais */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Redes Sociais
              </Typography>

              {socialMedias.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Você ainda não possui redes sociais cadastradas. 
                  Adicione suas redes para que recrutadores possam entrar em contato.
                </Alert>
              ) : (
                <List sx={{ mb: 3 }}>
                  {socialMedias.map((socialMedia) => (
                    <ListItem
                      key={socialMedia.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        {getPlatformIcon(socialMedia.platform)}
                      </Box>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {socialMedia.platform}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {socialMedia.url}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Adicionado em: {formatDate(socialMedia.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => setDeleteDialog({ 
                            open: true, 
                            type: 'social-media', 
                            id: socialMedia.id 
                          })}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Formulário para adicionar nova rede social */}
              <Typography variant="subtitle1" gutterBottom>
                Adicionar Nova Rede Social
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <TextField
                  label="Plataforma (ex: LinkedIn, GitHub)"
                  value={newSocialMedia.platform}
                  onChange={(e) => setNewSocialMedia(prev => ({ ...prev, platform: e.target.value }))}
                  sx={{ flex: '1 1 300px' }}
                  disabled={isAddingSocialMedia}
                />
                <TextField
                  label="URL Completa"
                  value={newSocialMedia.url}
                  onChange={(e) => setNewSocialMedia(prev => ({ ...prev, url: e.target.value }))}
                  sx={{ flex: '1 1 300px' }}
                  disabled={isAddingSocialMedia}
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
              </Box>

              <Button
                variant="contained"
                onClick={handleAddSocialMedia}
                disabled={isAddingSocialMedia || !newSocialMedia.platform.trim() || !newSocialMedia.url.trim()}
                startIcon={isAddingSocialMedia ? <CircularProgress size={20} /> : <AddIcon />}
              >
                {isAddingSocialMedia ? 'Adicionando...' : 'Adicionar Rede Social'}
              </Button>
            </Paper>
          </>
        )}
      </Box>

      {/* Dialog de Confirmação para Exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: 'summary' })}
      >
        <DialogTitle>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            {deleteDialog.type === 'summary' 
              ? 'Tem certeza que deseja excluir seu resumo profissional? Esta ação não pode ser desfeita.'
              : 'Tem certeza que deseja excluir esta rede social? Esta ação não pode ser desfeita.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: 'summary' })}>
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              if (deleteDialog.type === 'summary') {
                handleDeleteSummary();
              } else if (deleteDialog.id) {
                handleDeleteSocialMedia(deleteDialog.id);
              }
            }}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;