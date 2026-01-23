// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    CONFIRM_EMAIL: '/auth/confirm-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  PROFESSIONAL_INFO: {
    BASE: '/professional-info',
    SUMMARY: '/professional-info/summary',
    SOCIALS: '/professional-info/socials',
    SKILLS: '/professional-info/skills',
    EDUCATION: '/professional-info/education',
    CERTIFICATIONS: '/professional-info/certifications',
    LANGUAGES: '/professional-info/languages',
    EXPERIENCES: '/professional-info/experiences',
  },
  CV: {
    GENERATE: '/cv/generate',
    TEMPLATES: '/cv/templates',
  },
} as const;

// Constantes de aplicação
export const APP_CONSTANTS = {
  APP_NAME: 'CareerFlow',
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
} as const;

// Tempos de expiração (em milissegundos)
export const EXPIRATION_TIMES = {
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hora de inatividade
} as const;