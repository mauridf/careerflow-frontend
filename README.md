# CareerFlow Frontend

Interface web do CareerFlow — sistema SaaS para criação, gerenciamento e compartilhamento de currículos profissionais com foco em compatibilidade ATS.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Tests](https://img.shields.io/badge/tests-Vitest-brightgreen?logo=vitest)

---

## Stack Tecnológica

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| Framework | Next.js (App Router) | 16.2 |
| UI | React | 19.2 |
| Linguagem | TypeScript | 5 |
| Estilização | Tailwind CSS | 4 |
| Server State | TanStack React Query | 5 |
| Client State | Zustand | 5 |
| HTTP Client | Axios | 1.18 |
| Formulários | React Hook Form + Zod | 7.82 / 4.4 |
| Gráficos | Recharts | 3.9 |
| Ícones | Lucide React | 1.25 |
| Datas | date-fns | 4.4 |
| Testes | Vitest + Testing Library | 4.1 |
| Linter | ESLint (config-next) | 9 |
| Formatter | Prettier | - |

---

## Funcionalidades

- **Autenticação** — Login, registro, recuperação de senha, refresh token automático
- **Perfil Completo** — Informações pessoais, resumo profissional, foto
- **Habilidades** — CRUD com categorias, níveis de proficiência, reordenação
- **Experiências** — CRUD com descrição detalhada e período
- **Formação** — CRUD com nível, instituição e período
- **Certificações** — CRUD com ID e URL de credencial
- **Idiomas** — CRUD com níveis de fala, escrita e leitura
- **Redes Sociais** — CRUD (LinkedIn, GitHub, GitLab, Instagram, Facebook, Twitter, YouTube, Portfólio, Outro)
- **Currículo** — Visualização, templates (Moderno, Clássico, Minimalista, ATS), download PDF
- **Dashboard** — Estatísticas, gráfico de visualizações, atividades recentes
- **Insights** — Forças, melhorias, recomendações, score ATS, skills gap
- **Onboarding** — Fluxo guiado em 3 etapas
- **Admin** — Gestão de usuários, estatísticas do sistema
- **Compartilhamento** — Link público do currículo

---

## Estrutura do Projeto

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   #  Login, Register, Forgot/Reset password
│   ├── (dashboard)/              #  Painel autenticado
│   │   ├── dashboard/            #  Dashboard, Insights
│   │   ├── onboarding/           #  Onboarding (3 etapas + perfil)
│   │   ├── profile/              #  Perfil (skills, experiences, etc.)
│   │   ├── resume/               #  Currículo
│   │   ├── settings/             #  Configurações
│   │   └── DashboardLayoutClient.tsx
│   └── (admin)/                  # Painel admin
│       ├── admin/                # Dashboard admin
│       └── shared/[slug]/        # Currículo público
├── components/                   # Componentes compartilhados
│   ├── shared/                   # LoadingState, ErrorState, EmptyState, etc.
│   └── dashboard/                # ViewsChart
├── hooks/                        # React Query hooks
│   ├── useAuth.ts                # Auth hooks
│   ├── useProfile.ts             # Perfil hooks
│   ├── useSkills.ts              # Skills hooks
│   ├── useExperiences.ts         # Experiences hooks
│   ├── useEducation.ts           # Education hooks
│   ├── useCertificates.ts        # Certificates hooks
│   ├── useLanguages.ts           # Languages hooks
│   ├── useSocialNetworks.ts      # Social networks hooks
│   ├── useResume.ts              # Resume hooks
│   └── useDashboard.ts           # Dashboard hooks
├── lib/                          # Bibliotecas e utilitários
│   ├── axios.ts                  # Axios instance + interceptors
│   ├── constants.ts              # Rotas, limites, query keys
│   ├── enums.ts                  # Enums (SkillCategory, SocialNetworkType, etc.)
│   ├── utils.ts                  # cn() helper (clsx + tailwind-merge)
│   ├── formatters.ts             # Formatadores (date, phone, etc.)
│   └── validators.ts             # Zod schemas
├── services/                     # API services (axios calls)
│   ├── auth.service.ts
│   ├── profile.service.ts
│   ├── skills.service.ts
│   ├── social-networks.service.ts
│   └── resume.service.ts
├── types/                        # TypeScript interfaces
│   ├── auth.types.ts
│   ├── profile.types.ts
│   ├── social-networks.types.ts
│   └── resume.types.ts
└── stores/                       # Zustand stores
    ├── authStore.ts
    └── uiStore.ts
```

---

## Como Executar

### Pré-requisitos

- [Node.js 22+](https://nodejs.org/)
- [Backend CareerFlow API](https://github.com/seu-usuario/CareerFlow) rodando

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar ambiente

Copie o arquivo de exemplo e ajuste:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Executar em desenvolvimento

```bash
npm run dev
```

Acessar: [http://localhost:3000](http://localhost:3000)

### 4. Build de produção

```bash
npm run build
npm start
```

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção |
| `npm run lint` | ESLint em `src/` |
| `npm run format` | Formatar com Prettier |
| `npm run format:check` | Verificar formatação |
| `npm test` | Executar testes (Vitest) |
| `npm run test:coverage` | Testes com cobertura |

---

## Testes

```bash
# Executar todos os testes
npm test

# Com cobertura
npm run test:coverage
```

---

## Design System

- **Paleta:** Primary `#3525cd`, baseada em Material You
- **Fontes:** Geist Sans (display) + Inter (body)
- **Layout:** Bento grid com cards elevados
- **Ícones:** Lucide React
- **Tema:** Suporte a claro/escuro (next-themes)

---

## Rotas Principais

| Rota | Descrição |
|------|-----------|
| `/login` | Login |
| `/register` | Registro |
| `/dashboard` | Dashboard com gráficos |
| `/dashboard/insights` | Insights de carreira |
| `/profile` | Perfil completo |
| `/profile/skills` | Gerenciar habilidades |
| `/profile/social-networks` | Gerenciar redes sociais |
| `/resume` | Visualizar e baixar currículo |
| `/onboarding` | Onboarding guiado |
| `/admin` | Painel administrativo |
| `/shared/[slug]` | Currículo público |

---

## Licença

Projeto privado. Todos os direitos reservados.

**Versão:** 0.1 | **Última atualização:** Julho 2026
