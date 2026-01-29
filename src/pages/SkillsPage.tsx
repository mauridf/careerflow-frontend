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
import CodeIcon from '@mui/icons-material/Code';
import { skillsService } from '../api/skillsService';
import { SkillLevel, SkillType } from '../types';
import type { Skill, SkillRequest } from '../types';

const SkillsPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  // Estados para lista de skills
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados para filtros
  const [filters, setFilters] = useState({
    type: '',
    level: '',
  });

  // Estados para formulário
  const [newSkill, setNewSkill] = useState<SkillRequest>({
    name: '',
    type: '',
    level: '',
  });

  // Estados para modal de edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editFormData, setEditFormData] = useState<SkillRequest>({
    name: '',
    type: '',
    level: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Estados para modal de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  // Função para carregar skills com useCallback para evitar dependência circular
  const loadSkills = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const skillsData = await skillsService.getSkills(
        filters.type || undefined,
        filters.level || undefined
      );
      setSkills(skillsData);
    } catch (err: unknown) {
      console.error('Erro ao carregar skills:', err);
      setError('Não foi possível carregar as habilidades. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [user, filters.type, filters.level]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // Funções para formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim() || !newSkill.type || !newSkill.level) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const createdSkill = await skillsService.createSkill(newSkill);
      setSkills(prev => [...prev, createdSkill]);
      setNewSkill({ name: '', type: '', level: '' });
      setSuccessMessage('Habilidade adicionada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao adicionar skill:', err);
      setError('Não foi possível adicionar a habilidade. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para edição
  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill);
    setEditFormData({
        name: skill.name,
        type: skill.type,
        level: skill.level,
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

  const handleUpdateSkill = async () => {
    if (!editingSkill || !editFormData.name.trim() || !editFormData.type || !editFormData.level) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedSkill = await skillsService.updateSkill(editingSkill.id, editFormData);
      setSkills(prev => prev.map(skill => 
        skill.id === updatedSkill.id ? updatedSkill : skill
      ));
      setEditModalOpen(false);
      setEditingSkill(null);
      setSuccessMessage('Habilidade atualizada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao atualizar skill:', err);
      setError('Não foi possível atualizar a habilidade. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para exclusão
  const handleDeleteClick = (id: string) => {
    setSkillToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;

    try {
      await skillsService.deleteSkill(skillToDelete);
      setSkills(prev => prev.filter(skill => skill.id !== skillToDelete));
      setDeleteDialogOpen(false);
      setSkillToDelete(null);
      setSuccessMessage('Habilidade excluída com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao excluir skill:', err);
      setError('Não foi possível excluir a habilidade. Tente novamente.');
    }
  };

  // Funções auxiliares
  const getLevelColor = (level: string): 'info' | 'warning' | 'success' | 'default' => {
    switch (level) {
      case SkillLevel.BASIC: return 'info';
      case SkillLevel.INTERMEDIATE: return 'warning';
      case SkillLevel.ADVANCED: return 'success';
      default: return 'default';
    }
  };

  const getTypeChip = (type: string) => {
    return (
      <Chip
        label={type}
        size="small"
        variant="outlined"
        sx={{ ml: 1 }}
      />
    );
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
                Gerenciar Habilidades
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.name} - Cadastre e gerencie suas habilidades técnicas
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
              onRetry={loadSkills}
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl sx={{ flex: '1 1 300px' }}>
                <InputLabel id="filter-type-label">Tipo</InputLabel>
                <Select
                  labelId="filter-type-label"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Tipo"
                >
                  <MenuItem value="">Todos os tipos</MenuItem>
                  {Object.values(SkillType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: '1 1 300px' }}>
                <InputLabel id="filter-level-label">Nível</InputLabel>
                <Select
                  labelId="filter-level-label"
                  name="level"
                  value={filters.level}
                  onChange={handleFilterChange}
                  label="Nível"
                >
                  <MenuItem value="">Todos os níveis</MenuItem>
                  {Object.values(SkillLevel).map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={() => setFilters({ type: '', level: '' })}
                sx={{ alignSelf: 'center' }}
              >
                Limpar Filtros
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Formulário para adicionar nova skill */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Adicionar Nova Habilidade
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              label="Nome da Habilidade"
              name="name"
              value={newSkill.name}
              onChange={handleInputChange}
              sx={{ flex: '1 1 300px' }}
              placeholder="Ex: React, .NET, SQL Server"
              disabled={isSaving}
              required
            />
            
            <FormControl sx={{ flex: '1 1 300px' }} required>
              <InputLabel id="type-label">Tipo</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={newSkill.type}
                onChange={handleSelectChange}
                label="Tipo"
                disabled={isSaving}
              >
                <MenuItem value=""><em>Selecione um tipo</em></MenuItem>
                {Object.values(SkillType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: '1 1 300px' }} required>
              <InputLabel id="level-label">Nível</InputLabel>
              <Select
                labelId="level-label"
                name="level"
                value={newSkill.level}
                onChange={handleSelectChange}
                label="Nível"
                disabled={isSaving}
              >
                <MenuItem value=""><em>Selecione um nível</em></MenuItem>
                {Object.values(SkillLevel).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            onClick={handleAddSkill}
            disabled={isSaving || !newSkill.name.trim() || !newSkill.type || !newSkill.level}
            startIcon={isSaving ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {isSaving ? 'Adicionando...' : 'Adicionar Habilidade'}
          </Button>
        </Paper>

        {/* Lista de skills */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Minhas Habilidades ({skills.length})
            </Typography>
            <Chip
              icon={<CodeIcon />}
              label={`Total: ${skills.length}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Loading message="Carregando habilidades..." />
            </Box>
          ) : skills.length === 0 ? (
            <Alert severity="info">
              {filters.type || filters.level 
                ? 'Nenhuma habilidade encontrada com os filtros aplicados.'
                : 'Você ainda não possui habilidades cadastradas. Adicione sua primeira habilidade acima.'}
            </Alert>
          ) : (
            <List>
              {skills.map((skill) => (
                <ListItem
                  key={skill.id}
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
                        {skill.name}
                      </Typography>
                      <Chip
                        label={skill.level}
                        color={getLevelColor(skill.level)}
                        size="small"
                      />
                      {getTypeChip(skill.type)}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Adicionada em: {formatDate(skill.createdAt)}
                      {skill.updatedAt !== skill.createdAt && ` • Atualizada em: ${formatDate(skill.updatedAt)}`}
                    </Typography>
                  </Box>
                  
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditClick(skill)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(skill.id)}
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
          Editar Habilidade
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome da Habilidade"
              name="name"
              value={editFormData.name}
              onChange={handleEditInputChange}
              fullWidth
              required
              disabled={isSaving}
            />
            
            <FormControl fullWidth required disabled={isSaving}>
              <InputLabel id="edit-type-label">Tipo</InputLabel>
              <Select
                labelId="edit-type-label"
                name="type"
                value={editFormData.type}
                onChange={handleEditSelectChange}
                label="Tipo"
              >
                {Object.values(SkillType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={isSaving}>
              <InputLabel id="edit-level-label">Nível</InputLabel>
              <Select
                labelId="edit-level-label"
                name="level"
                value={editFormData.level}
                onChange={handleEditSelectChange}
                label="Nível"
              >
                {Object.values(SkillLevel).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
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
            onClick={handleUpdateSkill} 
            variant="contained"
            disabled={isSaving || !editFormData.name.trim() || !editFormData.type || !editFormData.level}
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
            Tem certeza que deseja excluir esta habilidade? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteSkill}
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

export default SkillsPage;