'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useChangePassword } from '@/hooks';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { ChangePasswordRequest } from '@/types';

const PASSWORD_RULES = [
  { label: 'Mínimo 8 caracteres', test: (v: string) => v.length >= 8 },
  { label: 'Pelo menos 1 letra maiúscula', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Pelo menos 1 número', test: (v: string) => /\d/.test(v) },
  { label: 'Pelo menos 1 caractere especial (@, #, !, %)', test: (v: string) => /[@#!%]/.test(v) },
];

export default function ChangePasswordPage() {
  const changePassword = useChangePassword();

  const [formData, setFormData] = useState<ChangePasswordRequest & { confirmPassword: string }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const isNewPasswordValid = PASSWORD_RULES.every((rule) => rule.test(formData.newPassword));
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0;
  const canSubmit = formData.currentPassword.length > 0 && isNewPasswordValid && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    changePassword.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <div className="flex flex-col gap-lg">
      {/* Header */}
      <div className="flex items-center gap-md">
        <Link
          href={ROUTES.DASHBOARD}
          className="text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-headline-md text-slate-900 font-display">Alterar Senha</h1>
          <p className="text-body-sm text-slate-500">
            Mantenha sua conta segura alterando sua senha regularmente
          </p>
        </div>
      </div>

      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white border border-outline-variant rounded-xl p-xl space-y-lg">
          {/* Current Password */}
          <div>
            <label className="font-display text-label-sm text-slate-700 mb-1.5 block">
              Senha Atual
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => updateField('currentPassword', e.target.value)}
                placeholder="Digite sua senha atual"
                className="w-full h-12 pl-10 pr-10 rounded-lg border border-outline-variant bg-white text-body-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="font-display text-label-sm text-slate-700 mb-1.5 block">
              Nova Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => updateField('newPassword', e.target.value)}
                placeholder="Digite sua nova senha"
                className="w-full h-12 pl-10 pr-10 rounded-lg border border-outline-variant bg-white text-body-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Rules Checklist */}
            <div className="mt-3 space-y-1.5">
              {PASSWORD_RULES.map((rule, idx) => {
                const passed = rule.test(formData.newPassword);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    {passed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                    )}
                    <span className={cn(
                      'text-label-sm font-display',
                      passed ? 'text-emerald-600' : 'text-slate-400'
                    )}>
                      {rule.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="font-display text-label-sm text-slate-700 mb-1.5 block">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="Repita sua nova senha"
                className="w-full h-12 pl-10 pr-10 rounded-lg border border-outline-variant bg-white text-body-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1.5 text-label-sm text-red-500 font-display">
                As senhas não coincidem
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canSubmit || changePassword.isPending}
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white font-display text-label-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changePassword.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Alterando...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Alterar Senha
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
