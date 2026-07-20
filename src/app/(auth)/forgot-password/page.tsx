'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Shield, Lock, Loader2 } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators';
import { useForgotPassword } from '@/hooks';
import { ROUTES } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const forgotPasswordMutation = useForgotPassword();
  const mainRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
  };

  const handleReset = () => {
    setShowSuccess(false);
    forgotPasswordMutation.reset();
  };

  // Parallax effect for background blurs
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      const blurs = main.querySelectorAll('.parallax-blur');
      blurs.forEach((blur, index) => {
        const factor = (index + 1) * 20;
        (blur as HTMLElement).style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full sticky top-0 bg-surface border-b border-outline-variant z-50">
        <div className="flex justify-between items-center h-16 px-gutter max-w-container mx-auto">
          <Link
            href="/"
            className="font-display text-display-lg-mobile font-bold text-primary"
          >
            CareerFlow
          </Link>
          <div className="hidden md:flex items-center gap-md">
            <a
              href="#"
              className="text-secondary hover:text-primary transition-colors duration-200 font-display text-label-md"
            >
              Suporte
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-grow flex items-center justify-center px-gutter py-xl relative overflow-hidden"
      >
        {/* Subtle Ambient Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="parallax-blur absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] transition-transform duration-700 ease-out" />
          <div className="parallax-blur absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-tertiary/5 rounded-full blur-[120px] transition-transform duration-700 ease-out" />
        </div>

        <div className="w-full max-w-[440px] relative z-10">
          {/* Back Action */}
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-xs text-secondary hover:text-primary transition-all duration-200 mb-lg group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-label-md">Voltar</span>
          </Link>

          {/* Auth Card */}
          <div
            className={`bg-surface-container-lowest border rounded-xl p-xl shadow-level-1 transition-all duration-500 ${
              showSuccess ? 'border-emerald-100' : 'border-outline-variant'
            }`}
          >
            {/* Initial State: Form */}
            {!showSuccess && (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="mb-xl">
                  <h1 className="font-display text-headline-md text-on-surface mb-xs">
                    Esqueceu sua senha?
                  </h1>
                  <p className="font-sans text-body-md text-on-surface-variant">
                    Digite seu email para receber um link de recuperação.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
                  {/* Email Field */}
                    <div className="space-y-base">
                    <label
                      htmlFor="email"
                      className="font-display text-label-md text-on-surface-variant block"
                    >
                      Email Profissional
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        placeholder="exemplo@careerflow.com"
                        {...register('email')}
                        className={`w-full h-12 px-md bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-sans text-body-md ${
                          errors.email ? 'border-error' : 'border-outline-variant'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-body-sm text-error">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full h-12 bg-primary-container text-on-primary font-display text-label-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {forgotPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        ENVIANDO...
                      </>
                    ) : (
                      'ENVIAR LINK'
                    )}
                  </button>
                </form>

                {/* Error Banner */}
                {forgotPasswordMutation.isError && (
                  <div className="mt-lg p-md bg-error-container border border-error/10 rounded-lg flex items-center gap-base">
                    <CheckCircle2 className="h-5 w-5 text-error flex-shrink-0" />
                    <p className="font-sans text-body-sm text-on-error-container">
                      {forgotPasswordMutation.error instanceof Error
                        ? forgotPasswordMutation.error.message
                        : 'Erro ao enviar email. Tente novamente.'}
                    </p>
                  </div>
                )}

                {/* Divider */}
                <div className="mt-xl flex items-center gap-md">
                  <div className="h-[1px] flex-grow bg-outline-variant/30" />
                </div>

                <div className="mt-lg text-center">
                  <Link
                    href={ROUTES.LOGIN}
                    className="font-sans text-body-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline"
                  >
                    Lembrou a senha? Faça login
                  </Link>
                </div>
              </div>
            )}

            {/* Success State */}
            {showSuccess && (
              <div className="text-center py-md animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-xl">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="font-display text-headline-sm text-on-surface mb-sm">
                  Email Enviado
                </h2>
                <p className="font-sans text-body-md text-on-surface-variant mb-xl px-md">
                  Se o email existir, um link será enviado para que você possa
                  redefinir sua senha com segurança.
                </p>
                <button
                  onClick={handleReset}
                  className="text-primary font-display text-label-md hover:underline underline-offset-4"
                >
                  Tentar outro email
                </button>
              </div>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mt-xl flex justify-center items-center gap-xl opacity-40 hover:opacity-60 transition-all duration-500">
            <div className="flex items-center gap-xs">
              <Shield className="h-4 w-4" />
              <span className="text-[10px] font-display font-bold tracking-widest uppercase">
                ATS Secure
              </span>
            </div>
            <div className="flex items-center gap-xs">
              <Lock className="h-4 w-4" />
              <span className="text-[10px] font-display font-bold tracking-widest uppercase">
                SSL Data
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container mx-auto gap-md">
          <div className="flex flex-col gap-xs items-center md:items-start">
            <div className="font-display text-headline-sm font-bold text-on-surface">
              CareerFlow
            </div>
            <p className="font-sans text-body-sm text-secondary">
              © {new Date().getFullYear()} CareerFlow. ATS-Optimized Excellence.
            </p>
          </div>
          <div className="flex gap-md">
            <a
              href="#"
              className="text-on-surface-variant font-sans text-body-sm hover:text-primary transition-all"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="text-on-surface-variant font-sans text-body-sm hover:text-primary transition-all"
            >
              Termos de Serviço
            </a>
            <a
              href="#"
              className="text-on-surface-variant font-sans text-body-sm hover:text-primary transition-all"
            >
              Central de Ajuda
            </a>
            <a
              href="#"
              className="text-on-surface-variant font-sans text-body-sm hover:text-primary transition-all"
            >
              Segurança
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}