'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Shield,
  Loader2,
  LockKeyhole,
} from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validators';
import { useResetPassword } from '@/hooks';
import { ROUTES } from '@/lib/constants';

const PASSWORD_RULES = [
  { key: 'length', label: 'Pelo menos 8 caracteres', regex: /.{8,}/ },
  { key: 'uppercase', label: 'Uma letra maiúscula', regex: /[A-Z]/ },
  {
    key: 'special',
    label: 'Um caractere especial (@, #, !, %)',
    regex: /[!@#$%^&*(),.?":{}|<>]/,
  },
] as const;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      token,
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const newPasswordValue = watch('newPassword', '');

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

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
          <div className="hidden md:flex gap-md">
            <a
              href="#"
              className="text-secondary font-medium hover:text-primary transition-colors duration-200 font-sans text-body-sm"
            >
              Ajuda
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-margin-mobile py-xl relative">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary/10 rounded-full blur-[80px]" />
        </div>

        {/* Reset Password Card */}
        <div className="w-full max-w-[480px] z-10">
          <div className="auth-glass bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl shadow-level-1">
            <div className="mb-xl text-center md:text-left">
              <h1 className="font-display text-display-lg-mobile text-on-surface mb-xs">
                Redefinir sua senha
              </h1>
              <p className="font-sans text-body-md text-on-surface-variant">
                Crie uma nova senha forte para acessar sua conta CareerFlow e
                continuar sua jornada profissional.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
              {/* Hidden Fields */}
              <input type="hidden" {...register('email')} />
              <input type="hidden" {...register('token')} />

              {/* New Password Field */}
              <div className="space-y-base">
                <label
                  htmlFor="newPassword"
                  className="font-display text-label-md text-on-surface-variant block"
                >
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Digite sua nova senha"
                    {...register('newPassword')}
                    className={`w-full h-12 px-md pr-12 bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-body-md ${
                      errors.newPassword
                        ? 'border-error'
                        : 'border-outline-variant'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                    aria-label={
                      showNewPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-body-sm text-error">
                    {errors.newPassword.message}
                  </p>
                )}

                {/* Checklist */}
                <div className="bg-surface-container-low p-md rounded-lg mt-base space-y-xs border border-outline-variant/30">
                  <p className="font-display text-label-sm text-on-surface-variant mb-xs">
                    A senha deve conter:
                  </p>
                  <ul className="space-y-1">
                    {PASSWORD_RULES.map((rule) => {
                      const isValid = rule.regex.test(newPasswordValue);
                      return (
                        <li
                          key={rule.key}
                          className={`flex items-center gap-xs font-sans text-body-sm transition-colors ${
                            isValid
                              ? 'text-emerald-600'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {isValid ? (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 flex-shrink-0" />
                          )}
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-base">
                <label
                  htmlFor="confirmPassword"
                  className="font-display text-label-md text-on-surface-variant block"
                >
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua nova senha"
                    {...register('confirmPassword')}
                    className={`w-full h-12 px-md pr-12 bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-body-md ${
                      errors.confirmPassword
                        ? 'border-error'
                        : 'border-outline-variant'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                    aria-label={
                      showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-body-sm text-error">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-md">
                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-primary-container text-on-primary font-bold py-md px-xl rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      REDEFININDO...
                    </>
                  ) : (
                    <>
                      REDEFINIR SENHA
                      <LockKeyhole className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error Banner */}
            {resetPasswordMutation.isError && (
              <div className="mt-lg p-md bg-error-container border border-error/10 rounded-lg flex items-center gap-base">
                <CheckCircle2 className="h-5 w-5 text-error flex-shrink-0" />
                <p className="font-sans text-body-sm text-on-error-container">
                  {resetPasswordMutation.error instanceof Error
                    ? resetPasswordMutation.error.message
                    : 'Erro ao redefinir senha. Tente novamente.'}
                </p>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-xl flex justify-center">
              <Link
                href={ROUTES.LOGIN}
                className="font-display text-label-md text-primary hover:underline flex items-center gap-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>

        {/* Side Graphic Decoration (Bento-style) - Desktop Only */}
        <div className="hidden xl:flex absolute right-margin-desktop top-1/2 -translate-y-1/2 w-80 flex-col gap-md pointer-events-none">
          {/* Security Card */}
          <div className="bg-surface-container-high border border-outline-variant p-md rounded-xl shadow-level-1 rotate-2">
            <div className="flex items-center gap-sm mb-xs">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-display text-label-md text-on-surface">
                Sua segurança é prioridade
              </span>
            </div>
            <p className="font-sans text-body-sm text-on-surface-variant">
              Utilizamos criptografia de ponta a ponta e padrões ATS para
              proteger seus dados.
            </p>
          </div>

          {/* Image Card */}
          <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-level-1 -rotate-3 ml-xl">
            <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-tertiary/20 rounded-lg mb-xs flex items-center justify-center">
              <LockKeyhole className="h-12 w-12 text-primary/60" />
            </div>
            <span className="font-display text-label-sm text-secondary uppercase tracking-widest">
              Proteção Ativa
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container mx-auto gap-md">
          <span className="font-display text-headline-sm font-bold text-on-surface">
            CareerFlow
          </span>
          <p className="font-sans text-body-sm text-secondary">
            © {new Date().getFullYear()} CareerFlow. ATS-Optimized Excellence.
          </p>
          <div className="flex gap-md">
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
          </div>
        </div>
      </footer>
    </div>
  );
}