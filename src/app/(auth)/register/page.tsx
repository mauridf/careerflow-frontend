'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { useRegister } from '@/hooks';
import { ROUTES } from '@/lib/constants';

const PASSWORD_RULES = [
  { key: 'length', label: '8+ caracteres', regex: /.{8,}/ },
  { key: 'uppercase', label: 'Letra Maiúscula', regex: /[A-Z]/ },
  { key: 'number', label: 'Letras e números', regex: /^(?=.*[a-zA-Z])(?=.*[0-9])/ },
  { key: 'special', label: 'Caractere especial', regex: /[^A-Za-z0-9]/ },
] as const;

function getPasswordStrength(score: number): { color: string; label: string } {
  if (score === 0) return { color: 'bg-slate-200', label: '' };
  if (score === 1) return { color: 'bg-error', label: 'Fraca' };
  if (score === 2) return { color: 'bg-secondary', label: 'Média' };
  if (score === 3) return { color: 'bg-tertiary-fixed-dim', label: 'Boa' };
  return { color: 'bg-primary', label: 'Forte' };
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password', '');

  const calculateStrength = useCallback((password: string): number => {
    return PASSWORD_RULES.filter((rule) => rule.regex.test(password)).length;
  }, []);

  const strengthScore = calculateStrength(passwordValue);
  const strengthInfo = getPasswordStrength(strengthScore);

  const onSubmit = (data: RegisterFormData) => {
    if (!acceptedTerms || !acceptedPrivacy) return;
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  const canSubmit =
    !registerMutation.isPending && acceptedTerms && acceptedPrivacy;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full sticky top-0 bg-surface border-b border-outline-variant z-50">
        <div className="flex justify-between items-center h-16 px-gutter max-w-container mx-auto">
          <Link
            href="/"
            className="font-display text-display-lg-mobile md:text-headline-md font-bold text-primary"
          >
            CareerFlow
          </Link>
          <div className="hidden md:flex gap-md items-center">
            <button className="text-secondary font-medium hover:text-primary transition-colors duration-200 font-sans text-body-sm">
              Central de Ajuda
            </button>
            <Link
              href={ROUTES.LOGIN}
              className="bg-primary-container text-on-primary px-md py-xs rounded-lg font-display text-label-md font-medium hover:opacity-80 transition-opacity"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-gutter relative overflow-hidden">
        {/* Decorative Ambient Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary/5 rounded-full blur-[80px] -z-10" />

        {/* Registration Container */}
        <div className="w-full max-w-[480px]">
          {/* Back Button */}
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-xs text-secondary hover:text-primary transition-colors mb-md group font-display text-label-md"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar</span>
          </Link>

          {/* Auth Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-level-1">
            <div className="mb-xl">
              <h1 className="font-display text-headline-md text-on-surface mb-xs">
                Crie sua conta gratuita
              </h1>
              <p className="font-sans text-body-md text-on-surface-variant">
                Comece a construir seu currículo hoje mesmo.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
              {/* Nome Completo */}
              <div className="flex flex-col gap-base">
                <label
                  htmlFor="name"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ex: João Silva"
                  {...register('name')}
                  className={`w-full h-12 px-md border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white font-sans text-body-md ${
                    errors.name ? 'border-error' : 'border-outline-variant'
                  }`}
                />
                {errors.name && (
                  <p className="text-body-sm text-error -mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-base">
                <label
                  htmlFor="email"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  E-mail Corporativo
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  {...register('email')}
                  className={`w-full h-12 px-md border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white font-sans text-body-md ${
                    errors.email ? 'border-error' : 'border-outline-variant'
                  }`}
                />
                {errors.email && (
                  <p className="text-body-sm text-error -mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Senha */}
              <div className="flex flex-col gap-base">
                <label
                  htmlFor="password"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className={`w-full h-12 px-md pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white font-sans text-body-md ${
                      errors.password
                        ? 'border-error'
                        : 'border-outline-variant'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-body-sm text-error -mt-1">
                    {errors.password.message}
                  </p>
                )}

                {/* Strength Meter */}
                <div className="mt-xs">
                  {/* Bars */}
                  <div className="flex gap-xs w-full mb-2">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`strength-bar flex-1 h-1 rounded-full transition-all duration-300 ${
                          index < strengthScore
                            ? strengthInfo.color
                            : 'bg-surface-container-highest'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Strength Label */}
                  {strengthScore > 0 && (
                    <p
                      className={`text-label-sm font-display ${
                        strengthScore === 1
                          ? 'text-error'
                          : strengthScore === 2
                            ? 'text-secondary'
                            : strengthScore === 3
                              ? 'text-tertiary-fixed-dim'
                              : 'text-primary'
                      }`}
                    >
                      Força da senha: {strengthInfo.label}
                    </p>
                  )}

                  {/* Rules Checklist */}
                  <div className="bg-surface-container-low p-md rounded-lg mt-3 space-y-xs border border-outline-variant/30">
                    <p className="font-display text-label-sm text-on-surface-variant mb-1">
                      A senha deve conter:
                    </p>
                    <div className="grid grid-cols-2 gap-y-1 gap-x-md">
                      {PASSWORD_RULES.map((rule) => {
                        const isValid = rule.regex.test(passwordValue);
                        return (
                          <div
                            key={rule.key}
                            className={`flex items-center gap-xs font-sans text-body-sm transition-colors ${
                              isValid ? 'text-primary' : 'text-on-surface-variant'
                            }`}
                          >
                            {isValid ? (
                              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 flex-shrink-0" />
                            )}
                            <span>{rule.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="flex flex-col gap-base">
                <label
                  htmlFor="confirmPassword"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Confirmar Senha
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full h-12 px-md border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white font-sans text-body-md ${
                    errors.confirmPassword
                      ? 'border-error'
                      : 'border-outline-variant'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-body-sm text-error -mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Agreements */}
              <div className="space-y-sm pt-sm">
                <label className="flex items-start gap-md cursor-pointer group">
                  <div className="relative flex items-center pt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="peer h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </div>
                  <span className="font-sans text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Aceito os{' '}
                    <a
                      href="#"
                      className="text-primary font-semibold hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Termos de Uso
                    </a>{' '}
                    do CareerFlow.
                  </span>
                </label>
                <label className="flex items-start gap-md cursor-pointer group">
                  <div className="relative flex items-center pt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptedPrivacy}
                      onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                      className="peer h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </div>
                  <span className="font-sans text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Compreendo a{' '}
                    <a
                      href="#"
                      className="text-primary font-semibold hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Política de Privacidade
                    </a>{' '}
                    de dados.
                  </span>
                </label>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-14 bg-primary text-on-primary font-display text-label-md tracking-widest rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-sm"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    CRIANDO CONTA...
                  </>
                ) : (
                  'CRIAR CONTA'
                )}
              </button>
            </form>

            {/* Error Banner */}
            {registerMutation.isError && (
              <div className="mt-lg p-md bg-error-container border border-error/10 rounded-lg flex items-center gap-base">
                <CheckCircle2 className="h-5 w-5 text-error flex-shrink-0" />
                <p className="font-sans text-body-sm text-on-error-container">
                  {registerMutation.error instanceof Error
                    ? registerMutation.error.message
                    : 'Erro ao criar conta. Tente novamente.'}
                </p>
              </div>
            )}

            {/* Login Redirect */}
            <div className="mt-xl text-center border-t border-outline-variant pt-lg">
              <p className="font-sans text-body-sm text-on-surface-variant">
                Já tem conta?{' '}
                <Link
                  href={ROUTES.LOGIN}
                  className="text-primary font-bold hover:underline transition-all"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container mx-auto gap-md">
          <div className="font-display text-headline-sm font-bold text-on-surface">
            CareerFlow
          </div>
          <div className="flex flex-wrap justify-center gap-md font-sans text-body-sm text-on-surface-variant">
            <a href="#" className="hover:text-primary underline transition-all">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-primary underline transition-all">
              Termos de Serviço
            </a>
            <a href="#" className="hover:text-primary underline transition-all">
              Central de Ajuda
            </a>
            <a href="#" className="hover:text-primary underline transition-all">
              Segurança
            </a>
          </div>
          <div className="font-sans text-body-sm text-secondary">
            © {new Date().getFullYear()} CareerFlow. ATS-Optimized Excellence.
          </div>
        </div>
      </footer>
    </div>
  );
}