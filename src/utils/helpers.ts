// Função para formatar datas
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
};

// Função para formatar telefone brasileiro
export const formatPhone = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
};

// Validação de email
export const isValidEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

// Validação de senha
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Extrair iniciais do nome
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};