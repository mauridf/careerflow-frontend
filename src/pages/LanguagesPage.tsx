import { useState, useEffect, useCallback } from 'react';
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
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  type SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LanguageIcon from '@mui/icons-material/Language';
import { languagesService } from '../api/languagesService';
import { LanguageLevel } from '../types';
import type { Language, LanguageRequest } from '../types';

const LanguagesPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  // Estados para lista de languages
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados para filtros
  const [filterLevel, setFilterLevel] = useState('');

  // Estados para formulário
  const [newLanguage, setNewLanguage] = useState<LanguageRequest>({
    name: '',
    level: '',
  });

  // Estados para modal de edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [editFormData, setEditFormData] = useState<LanguageRequest>({
    name: '',
    level: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Estados para modal de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState<string | null>(null);

  // Função para carregar languages
  const loadLanguages = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const languagesData = await languagesService.getLanguages(
        filterLevel || undefined
      );
      setLanguages(languagesData);
    } catch (err: unknown) {
      console.error('Erro ao carregar idiomas:', err);
      setError('Não foi possível carregar os idiomas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [user, filterLevel]);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  // Funções para formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLanguage(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewLanguage(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e: SelectChangeEvent) => {
    setFilterLevel(e.target.value);
  };

  const handleAddLanguage = async () => {
    if (!newLanguage.name.trim() || !newLanguage.level) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const createdLanguage = await languagesService.createLanguage(newLanguage);
      setLanguages(prev => [...prev, createdLanguage]);
      setNewLanguage({ name: '', level: '' });
      setSuccessMessage('Idioma adicionado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao adicionar idioma:', err);
      setError('Não foi possível adicionar o idioma. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para edição
  const handleEditClick = (language: Language) => {
    setEditingLanguage(language);
    setEditFormData({
      name: language.name,
      level: language.level,
    });
    setEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateLanguage = async () => {
    if (!editingLanguage || !editFormData.name.trim() || !editFormData.level) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedLanguage = await languagesService.updateLanguage(editingLanguage.id, editFormData);
      setLanguages(prev => prev.map(lang => 
        lang.id === updatedLanguage.id ? updatedLanguage : lang
      ));
      setEditModalOpen(false);
      setEditingLanguage(null);
      setSuccessMessage('Idioma atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao atualizar idioma:', err);
      setError('Não foi possível atualizar o idioma. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para exclusão
  const handleDeleteClick = (id: string) => {
    setLanguageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteLanguage = async () => {
    if (!languageToDelete) return;

    try {
      await languagesService.deleteLanguage(languageToDelete);
      setLanguages(prev => prev.filter(lang => lang.id !== languageToDelete));
      setDeleteDialogOpen(false);
      setLanguageToDelete(null);
      setSuccessMessage('Idioma excluído com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao excluir idioma:', err);
      setError('Não foi possível excluir o idioma. Tente novamente.');
    }
  };

  // Funções auxiliares
  const getLevelColor = (level: string): 'info' | 'warning' | 'success' | 'default' => {
    switch (level) {
      case LanguageLevel.BASIC: return 'info';
      case LanguageLevel.INTERMEDIATE: return 'warning';
      case LanguageLevel.ADVANCED: return 'success';
      case LanguageLevel.FLUENT: return 'default';
      default: return 'default';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case LanguageLevel.BASIC: return 'Básico';
      case LanguageLevel.INTERMEDIATE: return 'Intermediário';
      case LanguageLevel.ADVANCED: return 'Avançado';
      case LanguageLevel.FLUENT: return 'Fluente/Nativo';
      default: return level;
    }
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Gerenciar Idiomas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.name} - Cadastre e gerencie seus conhecimentos de idiomas
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Mensagens de sucesso/erro */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Box sx={{ mb: 3 }}>
            <ErrorMessage 
              message={error}
              onRetry={loadLanguages}
              fullWidth
            />
          </Box>
        )}

        {/* Filtros */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Filtros
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ flex: '1 1 300px' }}>
                <InputLabel id="filter-level-label">Nível</InputLabel>
                <Select
                  labelId="filter-level-label"
                  value={filterLevel}
                  onChange={handleFilterChange}
                  label="Nível"
                >
                  <MenuItem value="">Todos os níveis</MenuItem>
                  {Object.values(LanguageLevel).map((level) => (
                    <MenuItem key={level} value={level}>
                      {getLevelText(level)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={() => setFilterLevel('')}
                sx={{ alignSelf: 'center' }}
              >
                Limpar Filtro
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Formulário para adicionar novo idioma */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Adicionar Novo Idioma
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              label="Nome do Idioma"
              name="name"
              value={newLanguage.name}
              onChange={handleInputChange}
              sx={{ flex: '1 1 300px' }}
              placeholder="Ex: Inglês, Espanhol, Francês"
              disabled={isSaving}
              required
            />
            
            <FormControl sx={{ flex: '1 1 300px' }} required>
              <InputLabel id="level-label">Nível</InputLabel>
              <Select
                labelId="level-label"
                name="level"
                value={newLanguage.level}
                onChange={handleSelectChange}
                label="Nível"
                disabled={isSaving}
              >
                <MenuItem value=""><em>Selecione um nível</em></MenuItem>
                {Object.values(LanguageLevel).map((level) => (
                  <MenuItem key={level} value={level}>
                    {getLevelText(level)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            onClick={handleAddLanguage}
            disabled={isSaving || !newLanguage.name.trim() || !newLanguage.level}
            startIcon={isSaving ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {isSaving ? 'Adicionando...' : 'Adicionar Idioma'}
          </Button>
        </Paper>

        {/* Lista de idiomas */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Meus Idiomas ({languages.length})
            </Typography>
            <Chip
              icon={<LanguageIcon />}
              label={`Total: ${languages.length}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Loading message="Carregando idiomas..." />
            </Box>
          ) : languages.length === 0 ? (
            <Alert severity="info">
              {filterLevel 
                ? 'Nenhum idioma encontrado com o filtro aplicado.'
                : 'Você ainda não possui idiomas cadastrados. Adicione seu primeiro idioma acima.'}
            </Alert>
          ) : (
            <List>
              {languages.map((language) => (
                <ListItem
                  key={language.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 2 }}>
                        {language.name}
                      </Typography>
                      <Chip
                        label={getLevelText(language.level)}
                        color={getLevelColor(language.level)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Adicionado em: {formatDate(language.createdAt)}
                      {language.updatedAt !== language.createdAt && ` • Atualizado em: ${formatDate(language.updatedAt)}`}
                    </Typography>
                  </Box>
                  
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditClick(language)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(language.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar Idioma
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome do Idioma"
              name="name"
              value={editFormData.name}
              onChange={handleEditInputChange}
              fullWidth
              required
              disabled={isSaving}
            />
            
            <FormControl fullWidth required disabled={isSaving}>
              <InputLabel id="edit-level-label">Nível</InputLabel>
              <Select
                labelId="edit-level-label"
                name="level"
                value={editFormData.level}
                onChange={handleEditSelectChange}
                label="Nível"
              >
                {Object.values(LanguageLevel).map((level) => (
                  <MenuItem key={level} value={level}>
                    {getLevelText(level)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateLanguage} 
            variant="contained"
            disabled={isSaving || !editFormData.name.trim() || !editFormData.level}
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação para Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este idioma? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteLanguage}
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

export default LanguagesPage;