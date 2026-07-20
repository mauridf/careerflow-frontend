import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { QueryProvider, ThemeProvider, ToastProvider, AuthInit } from '@/providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CareerFlow — Plataforma de Carreira',
  description:
    'Gerencie sua carreira, crie currículos otimizados para ATS e acompanhe seu progresso profissional.',
  keywords: ['currículo', 'ATS', 'carreira', 'emprego', 'recrutamento'],
  authors: [{ name: 'CareerFlow' }],
  openGraph: {
    title: 'CareerFlow — Plataforma de Carreira',
    description: 'Gerencie sua carreira com inteligência.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}
      >
        <AuthInit />
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}