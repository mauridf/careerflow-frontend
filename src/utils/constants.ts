// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    CHECK_EMAIL: '/Auth/check-email',
  },
  PROFILE: {
    SUMMARY: '/Profile/summary',
    SOCIAL_MEDIAS: '/Profile/social-medias',
    DASHBOARD_STATS: '/Profile/dashboard/stats',
    RESUME: '/Profile/resume',
  },
  SKILLS: {
    BASE: '/Skills',
    DISTRIBUTION: '/Skills/distribution',
  },
} as const;

// Constantes de aplicação
export const APP_CONSTANTS = {
  APP_NAME: 'CareerFlow',
  TOKEN_KEY: 'careerflow_token',
  USER_KEY: 'careerflow_user',
  TOKEN_EXPIRY_KEY: 'careerflow_token_expiry',
} as const;

// Tempos de expiração (em milissegundos)
export const EXPIRATION_TIMES = {
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hora de inatividade
} as const;