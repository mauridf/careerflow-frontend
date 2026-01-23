import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Link, 
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import { authService } from '../api/authService';

// Estados brasileiros para o select
const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    state: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  // Debounce para verificar email
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        setEmailAvailable(null);
        return;
      }
      
      setIsCheckingEmail(true);
      try {
        const emailExists = await authService.checkEmail(formData.email);
        setEmailAvailable(!emailExists); // true se disponível, false se já existe
      } catch (err) {
        console.error('Erro ao verificar email:', err);
        setEmailAvailable(null);
      } finally {
        setIsCheckingEmail(false);
      }
    };
    
    const timer = setTimeout(checkEmailAvailability, 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro específico
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Limpar email availability quando mudar
    if (name === 'email') {
      setEmailAvailable(null);
    }
    
    // Limpar erro geral
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Nome
    if (!formData.name.trim()) {
      errors.name = 'Nome completo é obrigatório';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    // Email
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    } else if (emailAvailable === false) {
      errors.email = 'Este email já está em uso';
    }
    
    // Senha
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    // Confirmar senha
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }
    
    // Telefone (opcional mas valida se preenchido)
    if (formData.phone && !/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(formData.phone)) {
      errors.phone = 'Telefone inválido (ex: (11) 99999-9999)';
    }
    
    // Cidade
    if (!formData.city.trim()) {
      errors.city = 'Cidade é obrigatória';
    }
    
    // Estado
    if (!formData.state) {
      errors.state = 'Estado é obrigatório';
    } else if (!brazilianStates.includes(formData.state)) {
      errors.state = 'Estado inválido';
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
      await register(formData);
      
      // Sucesso - mostrar mensagem e redirecionar para login
      alert('Conta criada com sucesso! Você será redirecionado para fazer login.');
      navigate('/login');
    } catch (err) {
      // Erro já é tratado no contexto
      console.error('Erro no registro:', err);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  if (isLoading) {
    return <Loading fullScreen message="Criando sua conta..." />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        {/* Título */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
          Criar Conta no CareerFlow
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, textAlign: 'center' }}>
          Cadastre-se para começar a gerenciar sua carreira profissional
        </Typography>

        {/* Mensagem de erro geral */}
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Formulário */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Layout com Box em vez de Grid */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            
            {/* Nome completo */}
            <TextField
              required
              fullWidth
              id="name"
              label="Nome completo"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              disabled={isLoading}
            />

            {/* Email */}
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={
                validationErrors.email || 
                (isCheckingEmail ? 'Verificando disponibilidade...' : 
                 emailAvailable === true ? '✓ Email disponível' : 
                 emailAvailable === false ? '✗ Email já em uso' : '')
              }
              disabled={isLoading}
              InputProps={{
                endAdornment: isCheckingEmail ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
            />

            {/* Linha de senhas */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password || 'Mínimo 6 caracteres'}
                disabled={isLoading}
              />
              
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Senha"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                disabled={isLoading}
              />
            </Box>

            {/* Linha de telefone e cidade */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                id="phone"
                label="Telefone (opcional)"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                error={!!validationErrors.phone}
                helperText={validationErrors.phone}
                disabled={isLoading}
              />
              
              <TextField
                required
                fullWidth
                id="city"
                label="Cidade"
                name="city"
                autoComplete="address-level2"
                value={formData.city}
                onChange={handleChange}
                error={!!validationErrors.city}
                helperText={validationErrors.city}
                disabled={isLoading}
              />
            </Box>

            {/* Estado */}
            <FormControl fullWidth required error={!!validationErrors.state}>
              <InputLabel id="state-label">Estado</InputLabel>
              <Select
                labelId="state-label"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                label="Estado"
                disabled={isLoading}
              >
                <MenuItem value=""><em>Selecione um estado</em></MenuItem>
                {brazilianStates.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.state && (
                <Typography variant="caption" color="error">
                  {validationErrors.state}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Botão de submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading || isCheckingEmail}
            sx={{ mt: 4, mb: 3, py: 1.5 }}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>

          {/* Link para login */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{' '}
              <Link 
                component={RouterLink} 
                to="/login" 
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              >
                Faça login
              </Link>
            </Typography>
          </Box>

          {/* Termos de serviço */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Ao criar uma conta, você concorda com nossos{' '}
              <Link href="#" underline="hover">Termos de Serviço</Link> e{' '}
              <Link href="#" underline="hover">Política de Privacidade</Link>.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;