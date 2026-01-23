import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Link, 
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro específico quando usuário começa a digitar
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Limpar erro geral do contexto
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      // Erro já é tratado no contexto
      console.error('Erro no login:', err);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return <Loading fullScreen message="Fazendo login..." />;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Título */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Entrar no CareerFlow
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Acesse sua conta para gerenciar sua carreira
        </Typography>

        {/* Mensagem de erro geral */}
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Formulário */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            disabled={isLoading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Link para esqueci senha (futura implementação) */}
          <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password" 
              variant="body2"
              sx={{ cursor: 'pointer' }}
            >
              Esqueceu sua senha?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 2, mb: 3, py: 1.5 }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          {/* Link para cadastro */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{' '}
              <Link 
                component={RouterLink} 
                to="/register" 
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              >
                Cadastre-se
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Informações extras */}
        <Box sx={{ mt: 4, textAlign: 'center', maxWidth: '400px' }}>
          <Typography variant="caption" color="text.secondary">
            Ao entrar, você concorda com nossos{' '}
            <Link href="#" underline="hover">Termos de Serviço</Link> e{' '}
            <Link href="#" underline="hover">Política de Privacidade</Link>.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;