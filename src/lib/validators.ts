import { z } from 'zod';

// ============================================
// Auth Validators
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
    .max(200, 'Email deve ter no máximo 200 caracteres'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .max(200, 'Nome deve ter no máximo 200 caracteres'),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Formato de email inválido')
      .max(200, 'Email deve ter no máximo 200 caracteres'),
    password: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[a-zA-Z]/, 'Senha deve conter pelo menos uma letra')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido'),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Formato de email inválido'),
    token: z
      .string()
      .min(1, 'Token é obrigatório'),
    newPassword: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[a-zA-Z]/, 'Senha deve conter pelo menos uma letra')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Senha atual é obrigatória'),
    newPassword: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[a-zA-Z]/, 'Senha deve conter pelo menos uma letra')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

// ============================================
// Profile Validators
// ============================================

export const profileSchema = z.object({
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato inválido. Use (99) 99999-9999')
    .or(z.literal(''))
    .optional(),
  city: z
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .length(2, 'UF deve ter exatamente 2 caracteres')
    .optional()
    .or(z.literal('')),
  birthDate: z
    .string()
    .optional()
    .or(z.literal('')),
  professionalSummary: z
    .string()
    .min(100, 'Resumo deve ter no mínimo 100 caracteres')
    .max(2000, 'Resumo deve ter no máximo 2000 caracteres')
    .optional()
    .or(z.literal('')),
  currentPosition: z
    .string()
    .max(100, 'Cargo deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  currentCompany: z
    .string()
    .max(100, 'Empresa deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
});

// ============================================
// Skills Validators
// ============================================

export const skillSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome da habilidade é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  category: z
    .number('Categoria é obrigatória')
    .min(0, 'Categoria inválida')
    .max(7, 'Categoria inválida'),
  proficiencyLevel: z
    .number('Nível de proficiência é obrigatório')
    .min(0, 'Nível inválido')
    .max(3, 'Nível inválido')
    .default(0),
  isPrimary: z.boolean().default(false),
  displayOrder: z.number().optional(),
});

// ============================================
// Experiences Validators
// ============================================

export const experienceSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Nome da empresa é obrigatório')
    .max(200, 'Empresa deve ter no máximo 200 caracteres'),
  position: z
    .string()
    .min(1, 'Cargo é obrigatório')
    .max(200, 'Cargo deve ter no máximo 200 caracteres'),
  startDate: z
    .string()
    .min(1, 'Data de início é obrigatória'),
  endDate: z
    .string()
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(50, 'Descrição deve ter no mínimo 50 caracteres')
    .optional()
    .or(z.literal('')),
  skillsUsed: z.array(z.string()).optional(),
  city: z
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .length(2, 'UF deve ter exatamente 2 caracteres')
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .default('Brasil')
    .optional(),
  employmentType: z
    .number()
    .min(0, 'Tipo inválido')
    .max(6, 'Tipo inválido')
    .optional(),
});

// ============================================
// Education Validators
// ============================================

export const educationSchema = z.object({
  institution: z
    .string()
    .min(1, 'Instituição é obrigatória')
    .max(200, 'Instituição deve ter no máximo 200 caracteres'),
  course: z
    .string()
    .min(1, 'Curso é obrigatório')
    .max(200, 'Curso deve ter no máximo 200 caracteres'),
  educationLevel: z
    .number('Nível de formação é obrigatório')
    .min(0, 'Nível inválido')
    .max(8, 'Nível inválido'),
  startDate: z
    .string()
    .min(1, 'Data de início é obrigatória'),
  endDate: z
    .string()
    .optional()
    .or(z.literal('')),
  status: z
    .number()
    .min(0, 'Status inválido')
    .max(3, 'Status inválido')
    .default(1)
    .optional(),
  description: z
    .string()
    .optional()
    .or(z.literal('')),
  grade: z
    .string()
    .max(20, 'Nota deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  thesisTitle: z
    .string()
    .max(300, 'Título da tese deve ter no máximo 300 caracteres')
    .optional()
    .or(z.literal('')),
});

// ============================================
// Certificates Validators
// ============================================

export const certificateSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(300, 'Título deve ter no máximo 300 caracteres'),
  issuer: z
    .string()
    .min(1, 'Emissor é obrigatório')
    .max(200, 'Emissor deve ter no máximo 200 caracteres'),
  issueDate: z
    .string()
    .min(1, 'Data de emissão é obrigatória'),
  expirationDate: z
    .string()
    .optional()
    .or(z.literal('')),
  certificateId: z
    .string()
    .max(100, 'ID do certificado deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  credentialId: z
    .string()
    .max(100, 'ID da credencial deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  credentialUrl: z
    .string()
    .url('URL inválida')
    .max(500, 'URL deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
});

// ============================================
// Languages Validators
// ============================================

export const languageSchema = z.object({
  languageName: z
    .string()
    .min(1, 'Nome do idioma é obrigatório')
    .max(50, 'Idioma deve ter no máximo 50 caracteres'),
  proficiencyLevel: z
    .number('Nível de proficiência é obrigatório')
    .min(0, 'Nível inválido')
    .max(6, 'Nível inválido'),
  isNative: z.boolean().default(false),
});

// ============================================
// Social Networks Validators
// ============================================

export const socialNetworkSchema = z.object({
  networkType: z
    .number('Tipo de rede é obrigatório')
    .min(0, 'Tipo inválido')
    .max(8, 'Tipo inválido'),
  url: z
    .string()
    .min(1, 'URL é obrigatória')
    .url('URL inválida. Use http:// ou https://'),
  displayOrder: z.number().optional(),
});

// ============================================
// Admin Validators
// ============================================

export const adminUpdateUserSchema = z.object({
  name: z
    .string()
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .optional()
    .or(z.literal('')),
  role: z
    .string()
    .optional(),
});

// ============================================
// Export de tipos inferidos
// ============================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type CertificateFormData = z.infer<typeof certificateSchema>;
export type LanguageFormData = z.infer<typeof languageSchema>;
export type SocialNetworkFormData = z.infer<typeof socialNetworkSchema>;
export type AdminUpdateUserFormData = z.infer<typeof adminUpdateUserSchema>;