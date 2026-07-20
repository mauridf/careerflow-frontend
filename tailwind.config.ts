import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      fontSize: {
        'display-lg': [
          '48px',
          { lineHeight: '56px', fontWeight: '700', letterSpacing: '-0.02em' },
        ],
        'display-lg-mobile': [
          '32px',
          { lineHeight: '40px', fontWeight: '700', letterSpacing: '-0.02em' },
        ],
        'headline-md': [
          '24px',
          { lineHeight: '32px', fontWeight: '600', letterSpacing: '-0.01em' },
        ],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': [
          '14px',
          { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.01em' },
        ],
        'label-sm': ['12px', { lineHeight: '14px', fontWeight: '600' }],
      },
      colors: {
        background: '#faf8ff',
        'on-background': '#131b2e',
        surface: {
          DEFAULT: '#faf8ff',
          dim: '#d2d9f4',
          bright: '#faf8ff',
          'container-lowest': '#ffffff',
          'container-low': '#f2f3ff',
          container: '#eaedff',
          'container-high': '#e2e7ff',
          'container-highest': '#dae2fd',
        },
        'on-surface': '#131b2e',
        'on-surface-variant': '#464555',
        'inverse-surface': '#283044',
        'inverse-on-surface': '#eef0ff',
        outline: '#777587',
        'outline-variant': '#c7c4d8',
        'surface-tint': '#4d44e3',
        primary: {
          DEFAULT: '#3525cd',
          foreground: '#ffffff',
          container: '#4f46e5',
          'container-foreground': '#dad7ff',
          inverse: '#c3c0ff',
          fixed: '#e2dfff',
          'fixed-dim': '#c3c0ff',
          'on-fixed': '#0f0069',
          'on-fixed-variant': '#3323cc',
        },
        secondary: {
          DEFAULT: '#516072',
          foreground: '#ffffff',
          container: '#d2e1f7',
          'container-foreground': '#556477',
          fixed: '#d4e4fa',
          'fixed-dim': '#b9c8de',
          'on-fixed': '#0d1c2d',
          'on-fixed-variant': '#39485a',
        },
        tertiary: {
          DEFAULT: '#00505f',
          foreground: '#ffffff',
          container: '#006a7c',
          'container-foreground': '#93e8ff',
          fixed: '#acedff',
          'fixed-dim': '#4cd7f6',
          'on-fixed': '#001f26',
          'on-fixed-variant': '#004e5c',
        },
        error: {
          DEFAULT: '#ba1a1a',
          foreground: '#ffffff',
          container: '#ffdad6',
          'container-foreground': '#93000a',
        },
        // Tons de cinza para elementos de UI
        slate: {
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '300': '#cbd5e1',
          '400': '#94a3b8',
          '500': '#64748b',
          '600': '#475569',
          '700': '#334155',
          '800': '#1e293b',
          '900': '#0f172a',
          '950': '#020617',
        },
        // Cores semânticas para status
        success: {
          DEFAULT: '#059669',
          light: 'rgba(5, 150, 105, 0.1)',
        },
        warning: {
          DEFAULT: '#d97706',
          light: 'rgba(217, 119, 6, 0.1)',
        },
        info: {
          DEFAULT: '#0891b2',
          light: 'rgba(8, 145, 178, 0.1)',
        },
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        base: '8px',
        xs: '4px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '48px',
      },
      maxWidth: {
        container: '1280px',
      },
      boxShadow: {
        'level-0': 'none',
        'level-1': '0 0 0 1px #e2e8f0',
        'level-2':
          '0 0 0 1px #cbd5e1, 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'input-focus': '0 0 0 3px rgba(79, 70, 229, 0.15)',
      },
      screens: {
        mobile: { max: '767px' },
        tablet: { min: '768px', max: '1023px' },
        desktop: { min: '1024px' },
      },
    },
  },
  plugins: [animate],
};

export default config;