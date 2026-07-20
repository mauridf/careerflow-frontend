'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight, Mail, Lock, AlertCircle, X } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useLogin } from '@/hooks';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const isEmailValid = emailValue && !errors.email && emailValue.includes('@') && emailValue.split('@')[1]?.includes('.');

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="mesh-bg min-h-screen flex flex-col items-center justify-center p-md overflow-x-hidden">
      {/* Error Banner */}
      {loginMutation.isError && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-md animate-slide-down">
          <div className="bg-error-container text-on-error-container px-lg py-sm rounded-lg flex items-center gap-base shadow-lg border border-error/10 max-w-md w-full">
            <AlertCircle className="h-5 w-5 text-error flex-shrink-0" />
            <span className="font-label-md text-label-md">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : 'Email ou senha inválidos'}
            </span>
            <button
              onClick={() => loginMutation.reset()}
              className="ml-auto hover:opacity-70 transition-opacity"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-[440px] flex flex-col items-center">
        {/* Header / Logo */}
        <header className="text-center mb-xl">
          <h1 className="font-display text-display-lg-mobile md:text-display-lg font-bold text-primary tracking-tighter mb-xs">
            CareerFlow
          </h1>
          <p className="font-sans text-body-md text-secondary/80">
            Transformando carreiras
          </p>
        </header>

        {/* Auth Card */}
        <section className="w-full bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-level-2 p-lg md:p-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
            {/* Email Field */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="font-display text-label-md text-on-surface-variant mb-base"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={`w-full h-12 pl-10 pr-12 bg-white border rounded-lg text-body-md font-sans focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 ${
                    errors.email
                      ? 'border-error focus:ring-error/10 focus:border-error'
                      : isEmailValid
                        ? 'border-emerald-500'
                        : 'border-outline-variant'
                  }`}
                />
                {isEmailValid && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="h-5 w-5 text-emerald-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-body-sm text-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-base">
                <label
                  htmlFor="password"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Senha
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full h-12 pl-10 pr-12 bg-white border rounded-lg text-body-md font-sans focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200 ${
                    errors.password
                      ? 'border-error focus:ring-error/10 focus:border-error'
                      : 'border-outline-variant'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
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
                <p className="mt-1 text-body-sm text-error">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary/20"
              />
              <label
                htmlFor="remember"
                className="ml-2 font-sans text-body-sm text-secondary cursor-pointer select-none"
              >
                Lembrar-me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 bg-primary-container text-on-primary font-display text-label-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loginMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              ) : (
                <>
                  ENTRAR
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Separator */}
            <div className="flex items-center gap-md py-sm">
              <div className="h-[1px] flex-1 bg-outline-variant/50" />
              <span className="font-display text-label-sm text-outline uppercase tracking-wider">
                ou
              </span>
              <div className="h-[1px] flex-1 bg-outline-variant/50" />
            </div>

            {/* Social Buttons (Visual only - OAuth será implementado futuramente) */}
            <div className="grid grid-cols-2 gap-md">
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-base h-11 bg-white border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors font-display text-label-md text-on-surface opacity-60 cursor-not-allowed"
                title="Em breve"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-base h-11 bg-white border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors font-display text-label-md text-on-surface opacity-60 cursor-not-allowed"
                title="Em breve"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-lg pt-lg border-t border-outline-variant/30 flex flex-col gap-sm text-center">
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="font-sans text-body-sm text-primary hover:underline decoration-2 underline-offset-4 font-medium transition-all"
            >
              Esqueceu a senha?
            </Link>
            <p className="font-sans text-body-sm text-secondary">
              Não tem uma conta?{' '}
              <Link
                href={ROUTES.REGISTER}
                className="text-primary hover:underline font-semibold ml-xs"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </section>

        {/* Legal Footer */}
        <footer className="mt-xl text-center">
          <p className="font-display text-label-sm text-outline-variant">
            © {new Date().getFullYear()} CareerFlow. ATS-Optimized Excellence.
          </p>
        </footer>
      </main>
    </div>
  );
}