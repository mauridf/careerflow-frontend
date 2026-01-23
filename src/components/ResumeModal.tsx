import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  Chip,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { profileService } from '../api/profileService';
import type { ResumeResponse } from '../types';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  onGenerateATS: () => void;
}

const ResumeModal = ({ open, onClose, onGenerateATS }: ResumeModalProps) => {
  const [resumeData, setResumeData] = useState<ResumeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadResumeData();
    } else {
      // Resetar estado quando fechar
      setResumeData(null);
      setError(null);
    }
  }, [open]);

  const loadResumeData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await profileService.getResume();
      setResumeData(data);
    } catch (err: any) {
      console.error('Erro ao carregar dados do currículo:', err);
      setError('Não foi possível carregar os dados do currículo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getDuration = (startDate: string, endDate: string, isCurrent: boolean) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    let duration = '';
    if (years > 0) duration += `${years} ano${years > 1 ? 's' : ''}`;
    if (months > 0) {
      if (duration) duration += ' e ';
      duration += `${months} mês${months > 1 ? 'es' : ''}`;
    }
    
    return duration || 'Menos de 1 mês';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Resumo do Currículo
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : resumeData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Cabeçalho com informações pessoais */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h4" gutterBottom>
                {resumeData.user.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body1">
                  {resumeData.user.email}
                </Typography>
                {resumeData.user.phone && (
                  <Typography variant="body1">
                    • {resumeData.user.phone}
                  </Typography>
                )}
                <Typography variant="body1">
                  • {resumeData.user.city}, {resumeData.user.state}
                </Typography>
              </Box>
            </Paper>

            {/* Resumo Profissional */}
            {resumeData.summary && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Resumo Profissional
                </Typography>
                <Typography variant="body1" paragraph>
                  {resumeData.summary.summary}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            {/* Redes Sociais */}
            {resumeData.socialMedias.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Redes Sociais
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {resumeData.socialMedias.map((socialMedia) => (
                    <Chip
                      key={socialMedia.id}
                      label={socialMedia.platform}
                      component="a"
                      href={socialMedia.url}
                      target="_blank"
                      clickable
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            {/* Experiências Profissionais */}
            {resumeData.experiences.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Experiência Profissional
                </Typography>
                <List>
                  {resumeData.experiences.map((exp) => (
                    <ListItem key={exp.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {exp.position}
                            </Typography>
                            <Typography variant="body1" color="primary">
                              {exp.company}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(exp.startDate)} - {exp.isCurrent ? 'Atual' : formatDate(exp.endDate)}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {getDuration(exp.startDate, exp.endDate, exp.isCurrent)}
                        </Typography>
                        
                        {exp.responsibilities && (
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {exp.responsibilities}
                          </Typography>
                        )}
                        
                        {exp.skills.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {exp.skills.map((skill) => (
                              <Chip
                                key={skill.id}
                                label={skill.name}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            {/* Formação Acadêmica */}
            {resumeData.academics.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Formação Acadêmica
                </Typography>
                <List>
                  {resumeData.academics.map((academic) => (
                    <ListItem key={academic.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {academic.courseName}
                            </Typography>
                            <Typography variant="body1" color="primary">
                              {academic.institution}
                            </Typography>
                            <Typography variant="body2">
                              {academic.level}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(academic.startDate)} - {academic.isCurrent ? 'Atual' : formatDate(academic.endDate)}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            {/* Habilidades */}
            {resumeData.skills.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Habilidades
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {resumeData.skills.map((skill) => (
                    <Chip
                      key={skill.id}
                      label={`${skill.name} (${skill.level})`}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            {/* Certificados */}
            {resumeData.certificates.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Certificações
                </Typography>
                <List>
                  {resumeData.certificates.map((cert) => (
                    <ListItem key={cert.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {cert.name}
                        </Typography>
                        {cert.description && (
                          <Typography variant="body2" color="text.secondary">
                            {cert.description}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          Validade: {formatDate(cert.startDate)} - {cert.isValid ? formatDate(cert.endDate) : 'Expirado'}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            {/* Idiomas */}
            {resumeData.languages.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Idiomas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {resumeData.languages.map((language) => (
                    <Chip
                      key={language.id}
                      label={`${language.name} - ${language.level}`}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ) : null}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Fechar
        </Button>
        <Button 
          onClick={onGenerateATS} 
          variant="contained"
          disabled={!resumeData}
        >
          Gerar CV ATS
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResumeModal;