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
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LinkIcon from '@mui/icons-material/Link';
import { certificatesService } from '../api/certificatesService';
import type { Certificate, CertificateRequest } from '../types';

const CertificatesPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  // Estados para lista de certificates
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados para formulário
  const [newCertificate, setNewCertificate] = useState<CertificateRequest>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    certificateFile: '', // Agora é uma string (URL)
  });

  // Estados para modal de edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [editFormData, setEditFormData] = useState<CertificateRequest>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    certificateFile: '',
  });

  // Estados para modal de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Função para carregar certificates
  const loadCertificates = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const certificatesData = await certificatesService.getCertificates();
      setCertificates(certificatesData);
    } catch (err: unknown) {
      console.error('Erro ao carregar certificados:', err);
      setError('Não foi possível carregar os certificados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  // Funções para formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCertificate(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCertificate = async () => {
    // Validação básica
    if (!newCertificate.name.trim() || !newCertificate.startDate) {
      setError('Por favor, preencha os campos obrigatórios (Nome e Data de Início).');
      return;
    }

    // Validação de URL se fornecida
    if (newCertificate.certificateFile && !isValidUrl(newCertificate.certificateFile)) {
      setError('Por favor, insira uma URL válida para o certificado.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const createdCertificate = await certificatesService.createCertificate(newCertificate);
      setCertificates(prev => [...prev, createdCertificate]);
      
      // Reset form
      setNewCertificate({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        certificateFile: '',
      });
      
      setSuccessMessage('Certificado adicionado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao adicionar certificado:', err);
      setError('Não foi possível adicionar o certificado. Verifique os dados e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para edição
  const handleEditClick = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setEditFormData({
      name: certificate.name,
      description: certificate.description || '',
      startDate: certificate.startDate.split('T')[0], // Formato YYYY-MM-DD
      endDate: certificate.endDate ? certificate.endDate.split('T')[0] : '',
      certificateFile: certificate.certificatePath || '',
    });
    setEditModalOpen(true);
  };

  const handleUpdateCertificate = async () => {
    if (!editingCertificate || !editFormData.name.trim() || !editFormData.startDate) {
      setError('Por favor, preencha os campos obrigatórios.');
      return;
    }

    // Validação de URL se fornecida
    if (editFormData.certificateFile && !isValidUrl(editFormData.certificateFile)) {
      setError('Por favor, insira uma URL válida para o certificado.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedCertificate = await certificatesService.updateCertificate(
        editingCertificate.id,
        editFormData
      );

      setCertificates(prev => prev.map(cert => 
        cert.id === updatedCertificate.id ? updatedCertificate : cert
      ));
      setEditModalOpen(false);
      setEditingCertificate(null);
      setSuccessMessage('Certificado atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao atualizar certificado:', err);
      setError('Não foi possível atualizar o certificado. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções para exclusão
  const handleDeleteClick = (id: string) => {
    setCertificateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCertificate = async () => {
    if (!certificateToDelete) return;

    try {
      await certificatesService.deleteCertificate(certificateToDelete);
      setCertificates(prev => prev.filter(cert => cert.id !== certificateToDelete));
      setDeleteDialogOpen(false);
      setCertificateToDelete(null);
      setSuccessMessage('Certificado excluído com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('Erro ao excluir certificado:', err);
      setError('Não foi possível excluir o certificado. Tente novamente.');
    }
  };

  // Funções auxiliares
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getFileIcon = (url: string) => {
    if (url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('pdf')) {
      return <PictureAsPdfIcon color="error" fontSize="small" />;
    }
    return <LinkIcon color="primary" fontSize="small" />;
  };

  const getDomainFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Link externo';
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
                Gerenciar Certificados
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.name} - Cadastre e gerencie seus certificados e qualificações
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
              onRetry={loadCertificates}
              fullWidth
            />
          </Box>
        )}

        {/* Formulário para adicionar novo certificado */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Adicionar Novo Certificado
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              label="Nome do Certificado *"
              name="name"
              value={newCertificate.name}
              onChange={handleInputChange}
              sx={{ flex: '1 1 300px' }}
              placeholder="Ex: AWS Certified Solutions Architect"
              disabled={isSaving}
              required
            />
            
            <TextField
              label="Descrição"
              name="description"
              value={newCertificate.description}
              onChange={handleInputChange}
              sx={{ flex: '1 1 300px' }}
              placeholder="Breve descrição do certificado"
              disabled={isSaving}
              multiline
              rows={1}
            />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              label="Data de Início *"
              name="startDate"
              type="date"
              value={newCertificate.startDate}
              onChange={handleInputChange}
              sx={{ flex: '1 1 200px' }}
              disabled={isSaving}
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <TextField
              label="Data de Término"
              name="endDate"
              type="date"
              value={newCertificate.endDate}
              onChange={handleInputChange}
              sx={{ flex: '1 1 200px' }}
              disabled={isSaving}
              InputLabelProps={{ shrink: true }}
              helperText="Deixe em branco se não houver data de expiração"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="URL do Certificado (Opcional)"
              name="certificateFile"
              value={newCertificate.certificateFile}
              onChange={handleInputChange}
              fullWidth
              disabled={isSaving}
              placeholder="https://www.udemy.com/certificate/UC-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/"
              helperText="Cole a URL do certificado (ex: Udemy, Coursera, etc.)"
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleAddCertificate}
            disabled={isSaving || !newCertificate.name.trim() || !newCertificate.startDate}
            startIcon={isSaving ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {isSaving ? 'Adicionando...' : 'Adicionar Certificado'}
          </Button>
        </Paper>

        {/* Lista de certificados */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Meus Certificados ({certificates.length})
            </Typography>
            <Chip
              icon={<CardMembershipIcon />}
              label={`Total: ${certificates.length}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Loading message="Carregando certificados..." />
            </Box>
          ) : certificates.length === 0 ? (
            <Alert severity="info">
              Você ainda não possui certificados cadastrados. Adicione seu primeiro certificado acima.
            </Alert>
          ) : (
            <List>
              {certificates.map((certificate) => (
                <ListItem
                  key={certificate.id}
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
                          {certificate.name}
                        </Typography>
                        <Chip
                          icon={certificate.isValid ? <CheckCircleIcon /> : <CancelIcon />}
                          label={certificate.isValid ? 'Válido' : 'Expirado'}
                          color={certificate.isValid ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      
                      {certificate.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {certificate.description}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Início:</strong> {formatDate(certificate.startDate)}
                        </Typography>
                        {certificate.endDate && (
                          <Typography variant="body2">
                            <strong>Término:</strong> {formatDate(certificate.endDate)}
                          </Typography>
                        )}
                      </Box>

                      {certificate.certificatePath && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          {getFileIcon(certificate.certificatePath)}
                          <Typography variant="body2" color="text.secondary">
                            {getDomainFromUrl(certificate.certificatePath)}
                          </Typography>
                          <Link
                            href={certificate.certificatePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{ ml: 1 }}
                          >
                            (Acessar certificado)
                          </Link>
                        </Box>
                      )}
                    </Box>

                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditClick(certificate)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(certificate.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Adicionado em: {formatDate(certificate.createdAt)}
                    {certificate.updatedAt !== certificate.createdAt && 
                      ` • Atualizado em: ${formatDate(certificate.updatedAt)}`}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar Certificado
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome do Certificado *"
              name="name"
              value={editFormData.name}
              onChange={handleEditInputChange}
              fullWidth
              required
              disabled={isSaving}
            />
            
            <TextField
              label="Descrição"
              name="description"
              value={editFormData.description}
              onChange={handleEditInputChange}
              fullWidth
              multiline
              rows={2}
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
                value={editFormData.endDate}
                onChange={handleEditInputChange}
                fullWidth
                disabled={isSaving}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TextField
              label="URL do Certificado (Opcional)"
              name="certificateFile"
              value={editFormData.certificateFile}
              onChange={handleEditInputChange}
              fullWidth
              disabled={isSaving}
              placeholder="https://www.udemy.com/certificate/UC-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/"
              helperText="Cole a URL do certificado"
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateCertificate} 
            variant="contained"
            disabled={isSaving || !editFormData.name.trim() || !editFormData.startDate}
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
            Tem certeza que deseja excluir este certificado? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteCertificate}
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

export default CertificatesPage;