'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, HelpCircle, Send, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'seu@email.com';

  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleResend = () => {
    setResendState('sending');
    setTimeout(() => {
      setResendState('sent');
      setTimeout(() => {
        setResendState('idle');
      }, 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Simplificado */}
      <header className="w-full sticky top-0 bg-surface border-b border-outline-variant z-50">
        <div className="flex justify-between items-center h-16 px-gutter max-w-container mx-auto">
          <Link
            href="/"
            className="font-display text-display-lg-mobile font-bold text-primary"
          >
            CareerFlow
          </Link>
          <div className="hidden md:flex gap-md items-center">
            <span className="font-sans text-body-sm text-secondary">
              Aumentando suas chances com tecnologia.
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-gutter py-xl relative overflow-hidden">
        {/* Atmospheric Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px] opacity-10" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-tertiary rounded-full blur-[100px] opacity-10" />
        </div>

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Glass Card */}
        <div className="w-full max-w-[480px] relative z-10">
          <div className="glass-card rounded-xl p-xl flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.01]">
            {/* Icon State */}
            <div className="w-20 h-20 bg-primary-container/10 rounded-full flex items-center justify-center mb-xl">
              <Mail className="h-10 w-10 text-primary" />
            </div>

            {/* Typography */}
            <h1 className="font-display text-headline-md text-on-surface mb-md">
              Email Enviado!
            </h1>
            <p className="font-sans text-body-md text-on-surface-variant mb-xl leading-relaxed max-w-sm">
              Enviamos um link de verificação para{' '}
              <span className="font-semibold text-on-surface">{email}</span>.
              Verifique sua caixa de entrada e clique no link para ativar sua
              conta.
            </p>

            {/* Primary Action */}
            <Link
              href={ROUTES.LOGIN}
              className="w-full bg-primary-container text-on-primary py-md px-lg rounded-lg font-display text-label-md hover:bg-primary transition-all duration-200 active:opacity-80 flex justify-center items-center gap-base mb-lg"
            >
              IR PARA LOGIN
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Secondary Actions */}
            <div className="flex flex-col gap-sm w-full">
              <button
                onClick={handleResend}
                disabled={resendState !== 'idle'}
                className={`font-sans text-body-sm transition-all duration-200 underline underline-offset-4 decoration-outline-variant flex items-center justify-center gap-xs mx-auto ${
                  resendState === 'sent'
                    ? 'text-emerald-600 decoration-emerald-300'
                    : 'text-secondary hover:text-primary'
                } disabled:cursor-not-allowed`}
              >
                {resendState === 'sending' && (
                  <>
                    <span className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                    Enviando...
                  </>
                )}
                {resendState === 'sent' && (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Email reenviado com sucesso!
                  </>
                )}
                {resendState === 'idle' && (
                  <>
                    <Send className="h-4 w-4" />
                    Não recebeu? Reenviar email
                  </>
                )}
              </button>
            </div>

            {/* Support Indicator */}
            <div className="mt-xl pt-lg border-t border-outline-variant w-full flex items-center justify-center gap-xs">
              <HelpCircle className="h-4 w-4 text-secondary" />
              <span className="font-display text-label-sm text-secondary">
                Precisa de ajuda? Contate o suporte.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container mx-auto gap-md">
          <div className="flex flex-col gap-xs items-center md:items-start">
            <span className="font-display text-headline-sm font-bold text-on-surface">
              CareerFlow
            </span>
            <span className="font-sans text-body-sm text-secondary">
              © {new Date().getFullYear()} CareerFlow. ATS-Optimized Excellence.
            </span>
          </div>
          <nav className="flex gap-md flex-wrap justify-center">
            <a
              href="#"
              className="font-sans text-body-sm text-on-surface-variant hover:text-primary underline transition-all"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="font-sans text-body-sm text-on-surface-variant hover:text-primary underline transition-all"
            >
              Termos de Serviço
            </a>
            <a
              href="#"
              className="font-sans text-body-sm text-on-surface-variant hover:text-primary underline transition-all"
            >
              Central de Ajuda
            </a>
            <a
              href="#"
              className="font-sans text-body-sm text-on-surface-variant hover:text-primary underline transition-all"
            >
              Segurança
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/* Componente de Partículas Flutuantes */
function FloatingParticles() {
  const [particles] = useState<
    Array<{ id: number; size: number; left: number; top: number; duration: number; delay: number }>
  >(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10000 + 8000,
      delay: Math.random() * 5000,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-primary/20 rounded-full animate-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDuration: `${particle.duration}ms`,
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}