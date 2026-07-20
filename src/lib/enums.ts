// ============================================
// Enums da Aplicação
// ============================================

export const SkillCategory: Record<number, { label: string; icon: string }> = {
  0: { label: 'Backend', icon: '⚙️' },
  1: { label: 'Frontend', icon: '🎨' },
  2: { label: 'Banco de Dados', icon: '🗄️' },
  3: { label: 'Cloud & DevOps', icon: '☁️' },
  4: { label: 'Arquitetura & Padrões', icon: '🏗️' },
  5: { label: 'Ferramentas', icon: '🔧' },
  6: { label: 'Soft Skills', icon: '🤝' },
  7: { label: 'Outras Habilidades', icon: '📦' },
};

export const ProficiencyLevel: Record<number, { label: string; score: number }> = {
  0: { label: 'Básico', score: 25 },
  1: { label: 'Intermediário', score: 50 },
  2: { label: 'Avançado', score: 75 },
  3: { label: 'Especialista', score: 100 },
};

export const EducationLevel: Record<number, string> = {
  0: 'Ensino Fundamental',
  1: 'Ensino Médio',
  2: 'Curso Técnico',
  3: 'Graduação',
  4: 'Pós-Graduação',
  5: 'Especialização',
  6: 'Mestrado',
  7: 'Doutorado',
  8: 'Outro',
};

export const EducationStatus: Record<number, string> = {
  0: 'Em Andamento',
  1: 'Concluído',
  2: 'Pausado',
  3: 'Abandonado',
};

export const LanguageLevel: Record<number, { label: string; score: number }> = {
  0: { label: 'A1 - Iniciante', score: 10 },
  1: { label: 'A2 - Básico', score: 25 },
  2: { label: 'B1 - Intermediário', score: 45 },
  3: { label: 'B2 - Intermediário Superior', score: 65 },
  4: { label: 'C1 - Avançado', score: 85 },
  5: { label: 'C2 - Proficiente', score: 95 },
  6: { label: 'Nativo', score: 100 },
};

export const SocialNetworkType: Record<number, string> = {
  0: 'LinkedIn',
  1: 'GitHub',
  2: 'GitLab',
  3: 'Instagram',
  4: 'Facebook',
  5: 'Twitter',
  6: 'YouTube',
  7: 'Portfólio',
  8: 'Outro',
};

export const EmploymentType: Record<number, string> = {
  0: 'Tempo Integral',
  1: 'Meio Período',
  2: 'Contrato',
  3: 'Estágio',
  4: 'Freelance',
  5: 'Remoto',
  6: 'Voluntário',
};

export const UserRole: Record<string, string> = {
  User: 'Usuário',
  PremiumUser: 'Usuário Premium',
  Admin: 'Administrador',
};

export const ErrorCode: Record<string, string> = {
  VALIDATION_ERROR: 'Erro de validação',
  UNAUTHORIZED: 'Não autorizado',
  NOT_FOUND: 'Não encontrado',
  CONFLICT: 'Conflito',
  DOMAIN_ERROR: 'Erro de regra de negócio',
  RATE_LIMIT: 'Limite de requisições excedido',
  INTERNAL_ERROR: 'Erro interno do servidor',
};