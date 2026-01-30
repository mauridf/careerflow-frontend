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
  CircularProgress,
  Chip,
  FormControlLabel,
  Checkbox,
  Autocomplete
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PaidIcon from '@mui/icons-material/Paid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ConstructionIcon from '@mui/icons-material/Construction';
import { experiencesService } from '../api/experiencesService';
import { skillsService } from '../api/skillsService';
import type { ProfessionalExperience, ProfessionalExperienceRequest, Skill } from '../types';

const ExperiencesPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  // Estados para lista de experiences
  const [experiences, setExperiences] = useState<ProfessionalExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados para skills disponíveis
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  // Estados para formulário
  const [newExperience, setNewExperience] = useState<ProfessionalExperienceRequest>({
    company: '',
    position: '',
    startDate: '',
    endDate: null,
    responsibilities: '',
    isPaid: true,
    skillIds: [],
  });
  const [selectedSkillNames, setSelectedSkillNames] = useState<string[]>([]);

  // Estados para modal de edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ProfessionalExperience | null>(null);
  const [editFormData, setEditFormData] = useState<ProfessionalExperienceRequest>({
    company: '',
    position: '',
    startDate: '',
    endDate: null,
    responsibilities: '',
    isPaid: true,
    skillIds: [],
  });
  const [editSelectedSkillNames, setEditSelectedSkillNames] = useState<string[]>([]);

  // Estados para modal de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [editIsCurrentJob, setEditIsCurrentJob] = useState(false);

  // Carregar experiences e skills
  const loadExperiences = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const experiencesData = await experiencesService.getExperiences();
      setExperiences(experiencesData);
    } catch (err: unknown) {
      console.error('Erro ao carregar experiências:', err);
      setError('Não foi possível carregar as experiências. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadSkills = useCallback(async () => {
    if (!user) return;

    setIsLoadingSkills(true);
    try {
      const skillsData = await skillsService.getSkills();
      setAvailableSkills(skillsData);
    } catch (err: unknown) {
      console.error('Erro ao carregar skills:', err);
    } finally {
      setIsLoadingSkills(false);
    }
  }, [user]);

  useEffect(() => {
    loadExperiences();
    loadSkills();
  }, [loadExperiences, loadSkills]);

  // Funções para formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewExperience(prev => ({ ...prev, [name]: checked }));
  };

  const handleEditCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCurrentJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsCurrentJob(checked);
    if (checked) {
      setNewExperience(prev => ({ ...prev, endDate: null }));
    }
  };

  const handleEditCurrentJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setEditIsCurrentJob(checked);
    if (checked) {
      setEditFormData(prev => ({ ...prev, endDate: null }));
    }
  };

  const handleSkillsChange = (
    event: React.SyntheticEvent<Element, Event>, 
    newValue: string[]
    ) => {
    setSelectedSkillNames(newValue);
    
    // Converter nomes para IDs
    const selectedSkillIds = newValue
        .map(skillName => {
        const skill = availableSkills.find(s => s.name === skillName);
        return skill?.id;
        })
        .filter((id): id is string => id !== undefined);

    setNewExperience(prev => ({ ...prev, skillIds: selectedSkillIds }));
    };

    const handleEditSkillsChange = (
    event: React.SyntheticEvent<Element, Event>, 
    newValue: string[]
    ) => {
    setEditSelectedSkillNames(newValue);
    
    // Converter nomes para IDs
    const selectedSkillIds = newValue
        .map(skillName => {
        const skill = availableSkills.find(s => s.name === skillName);
        return skill?.id;
        })
        .filter((id): id is string => id !== undefined);

    setEditFormData(prev => ({ ...prev, skillIds: selectedSkillIds }));
    };

  const handleAddExperience = async () => {
    // Validação básica
    if (!newExperience.company.trim() || !newExperience.position.trim() || !newExperience.startDate) {
      setError('Por favor, preencha os campos obrigatórios (Empresa, Cargo e Data de Início).');
      return;
    }

    if (!isCurrentJob && !newExperience.endDate) {
      setError('Por favor, informe a data de término ou marque como emprego atual.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const createdExperience = await experiencesService.createExperience(newExperience);
      setExperiences(prev => [...prev, createdExperience]);
      
      // Reset form
      setNewExperience({
        company: '',
        position: '',
        startDate: '',
        endDate: null,
        responsibilities: '',
        isPaid: true,
        skillIds: [],
      });
      setSelectedSkillNames([]);
      setIsCurrentJob(false);
      
      setSuccessMessage('Experiência adicionada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao adicionar experiência:', err);
      setError('Não foi possível adicionar a experiência. Verifique os dados e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para edição
  const handleEditClick = (experience: ProfessionalExperience) => {
    setEditingExperience(experience);
    setEditFormData({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate.split('T')[0],
      endDate: experience.endDate ? experience.endDate.split('T')[0] : null,
      responsibilities: experience.responsibilities,
      isPaid: experience.isPaid,
      skillIds: experience.skills.map(skill => skill.id),
    });
    setEditSelectedSkillNames(experience.skills.map(skill => skill.name));
    setEditIsCurrentJob(!experience.endDate);
    setEditModalOpen(true);
  };

  const handleUpdateExperience = async () => {
    if (!editingExperience || !editFormData.company.trim() || !editFormData.position.trim() || !editFormData.startDate) {
      setError('Por favor, preencha os campos obrigatórios.');
      return;
    }

    if (!editIsCurrentJob && !editFormData.endDate) {
      setError('Por favor, informe a data de término ou marque como emprego atual.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedExperience = await experiencesService.updateExperience(
        editingExperience.id,
        editFormData
      );

      setExperiences(prev => prev.map(exp => 
        exp.id === updatedExperience.id ? updatedExperience : exp
      ));
      setEditModalOpen(false);
      setEditingExperience(null);
      setSuccessMessage('Experiência atualizada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao atualizar experiência:', err);
      setError('Não foi possível atualizar a experiência. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para exclusão
  const handleDeleteClick = (id: string) => {
    setExperienceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteExperience = async () => {
    if (!experienceToDelete) return;

    try {
      await experiencesService.deleteExperience(experienceToDelete);
      setExperiences(prev => prev.filter(exp => exp.id !== experienceToDelete));
      setDeleteDialogOpen(false);
      setExperienceToDelete(null);
      setSuccessMessage('Experiência excluída com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao excluir experiência:', err);
      setError('Não foi possível excluir a experiência. Tente novamente.');
    }
  };

  // Funções auxiliares
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Atual';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getDuration = (startDate: string, endDate: string | null) => {
    try {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();
      
      const years = end.getFullYear() - start.getFullYear();
      const months = end.getMonth() - start.getMonth();
      
      let duration = '';
      if (years > 0) {
        duration += `${years} ${years === 1 ? 'ano' : 'anos'}`;
      }
      if (months > 0 || years === 0) {
        if (duration) duration += ' e ';
        duration += `${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
      
      return duration || 'Menos de 1 mês';
    } catch {
      return '';
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
                Gerenciar Experiências Profissionais
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.name} - Cadastre e gerencie suas experiências profissionais
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
              onRetry={loadExperiences}
              fullWidth
            />
          </Box>
        )}

        {/* Formulário para adicionar nova experiência */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Adicionar Nova Experiência
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              label="Empresa *"
              name="company"
              value={newExperience.company}
              onChange={handleInputChange}
              sx={{ flex: '1 1 300px' }}
              placeholder="Nome da empresa"
              disabled={isSaving}
              required
              InputProps={{
                startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
            
            <TextField
              label="Cargo *"
              name="position"
              value={newExperience.position}
              onChange={handleInputChange}
              sx={{ flex: '1 1 300px' }}
              placeholder="Ex: Desenvolvedor Frontend"
              disabled={isSaving}
              required
              InputProps={{
                startAdornment: <WorkIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              label="Data de Início *"
              name="startDate"
              type="date"
              value={newExperience.startDate}
              onChange={handleInputChange}
              sx={{ flex: '1 1 200px' }}
              disabled={isSaving}
              InputLabelProps={{ shrink: true }}
              required
              InputProps={{
                startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
            
            <TextField
              label="Data de Término"
              name="endDate"
              type="date"
              value={newExperience.endDate || ''}
              onChange={handleInputChange}
              sx={{ flex: '1 1 200px' }}
              disabled={isSaving || isCurrentJob}
              InputLabelProps={{ shrink: true }}
              helperText={isCurrentJob ? 'Emprego atual - data de término desabilitada' : 'Deixe em branco se for emprego atual'}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCurrentJob}
                  onChange={handleCurrentJobChange}
                  disabled={isSaving}
                />
              }
              label="Emprego atual"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isPaid"
                  checked={newExperience.isPaid}
                  onChange={handleCheckboxChange}
                  disabled={isSaving}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PaidIcon sx={{ mr: 1, fontSize: 20 }} />
                  Experiência remunerada
                </Box>
              }
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Responsabilidades e Conquistas *"
              name="responsibilities"
              value={newExperience.responsibilities}
              onChange={handleInputChange}
              fullWidth
              disabled={isSaving}
              required
              multiline
              rows={3}
              placeholder="Descreva suas responsabilidades, conquistas e atividades principais..."
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Autocomplete
              multiple
              options={availableSkills.map(skill => skill.name)}
              value={selectedSkillNames}
              onChange={handleSkillsChange}
              disabled={isSaving || isLoadingSkills}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills utilizadas (opcional)"
                  placeholder="Selecione as skills utilizadas nesta experiência"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <ConstructionIcon sx={{ mr: 1, color: 'action.active' }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  helperText="Selecione as skills que foram utilizadas ou desenvolvidas nesta experiência"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleAddExperience}
            disabled={isSaving || !newExperience.company.trim() || !newExperience.position.trim() || !newExperience.startDate}
            startIcon={isSaving ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {isSaving ? 'Adicionando...' : 'Adicionar Experiência'}
          </Button>
        </Paper>

        {/* Lista de experiências */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Minhas Experiências ({experiences.length})
            </Typography>
            <Chip
              icon={<WorkIcon />}
              label={`Total: ${experiences.length}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Loading message="Carregando experiências..." />
            </Box>
          ) : experiences.length === 0 ? (
            <Alert severity="info">
              Você ainda não possui experiências cadastradas. Adicione sua primeira experiência acima.
            </Alert>
          ) : (
            <List>
              {experiences.map((experience) => (
                <ListItem
                  key={experience.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 2,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 2 }}>
                          {experience.position} - {experience.company}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            icon={experience.isCurrent ? <CheckCircleIcon /> : <CancelIcon />}
                            label={experience.isCurrent ? 'Atual' : 'Concluída'}
                            color={experience.isCurrent ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                          
                          {experience.isPaid && (
                            <Chip
                              icon={<PaidIcon />}
                              label="Remunerada"
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Período:</strong> {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Duração:</strong> {getDuration(experience.startDate, experience.endDate)}
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Responsabilidades:</strong> {experience.responsibilities}
                      </Typography>

                      {experience.skills.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>Skills utilizadas:</strong>
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {experience.skills.map((skill) => (
                              <Chip
                                key={skill.id}
                                label={skill.name}
                                size="small"
                                variant="outlined"
                                color="secondary"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditClick(experience)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(experience.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Adicionado em: {formatDate(experience.createdAt)}
                    {experience.updatedAt !== experience.createdAt && 
                      ` • Atualizado em: ${formatDate(experience.updatedAt)}`}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Editar Experiência
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Empresa *"
              name="company"
              value={editFormData.company}
              onChange={handleEditInputChange}
              fullWidth
              required
              disabled={isSaving}
            />
            
            <TextField
              label="Cargo *"
              name="position"
              value={editFormData.position}
              onChange={handleEditInputChange}
              fullWidth
              required
              disabled={isSaving}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Data de Início *"
                name="startDate"
                type="date"
                value={editFormData.startDate}
                onChange={handleEditInputChange}
                fullWidth
                required
                disabled={isSaving}
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                label="Data de Término"
                name="endDate"
                type="date"
                value={editFormData.endDate || ''}
                onChange={handleEditInputChange}
                fullWidth
                disabled={isSaving || editIsCurrentJob}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editIsCurrentJob}
                    onChange={handleEditCurrentJobChange}
                    disabled={isSaving}
                  />
                }
                label="Emprego atual"
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isPaid"
                    checked={editFormData.isPaid}
                    onChange={handleEditCheckboxChange}
                    disabled={isSaving}
                  />
                }
                label="Experiência remunerada"
              />
            </Box>

            <TextField
              label="Responsabilidades e Conquistas *"
              name="responsibilities"
              value={editFormData.responsibilities}
              onChange={handleEditInputChange}
              fullWidth
              required
              disabled={isSaving}
              multiline
              rows={3}
            />

            <Autocomplete
              multiple
              options={availableSkills.map(skill => skill.name)}
              value={editSelectedSkillNames}
              onChange={handleEditSkillsChange}
              disabled={isSaving || isLoadingSkills}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills utilizadas (opcional)"
                  placeholder="Selecione as skills utilizadas nesta experiência"
                  helperText="Selecione as skills que foram utilizadas ou desenvolvidas nesta experiência"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateExperience} 
            variant="contained"
            disabled={isSaving || !editFormData.company.trim() || !editFormData.position.trim() || !editFormData.startDate}
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
            Tem certeza que deseja excluir esta experiência? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteExperience}
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

export default ExperiencesPage;