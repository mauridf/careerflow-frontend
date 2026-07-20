'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { z } from 'zod';
import { useUpdateProfile } from '@/hooks';
import { ROUTES, LIMITS } from '@/lib/constants';

const professionalSummarySchema = z.object({
  professionalSummary: z
    .string()
    .min(LIMITS.PROFESSIONAL_SUMMARY_MIN, `Mínimo ${LIMITS.PROFESSIONAL_SUMMARY_MIN} caracteres`)
    .max(LIMITS.PROFESSIONAL_SUMMARY_MAX, `Máximo ${LIMITS.PROFESSIONAL_SUMMARY_MAX} caracteres`),
});

type ProfessionalSummaryFormData = z.infer<typeof professionalSummarySchema>;

const tips = [
  {
    text: 'Escreva no mínimo ',
    bold: '100 caracteres',
    end: ' para um resumo relevante.',
  },
  {
    text: 'Utilize ',
    bold: 'palavras-chave',
    end: ' da sua área para ser encontrado por ATS.',
  },
  {
    text: 'Destaque ',
    bold: 'conquistas quantificáveis',
    end: ' (ex: aumento de 20% em receita).',
  },
];

export default function OnboardingStep2Page() {
  const router = useRouter();
  const updateProfile = useUpdateProfile();

  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfessionalSummaryFormData>({
    resolver: zodResolver(professionalSummarySchema),
    defaultValues: {
      professionalSummary: '',
    },
  });

  const summaryValue = watch('professionalSummary', '');

  const onSubmit = async (data: ProfessionalSummaryFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      router.push(ROUTES.ONBOARDING_STEP3);
    } catch {
      // Erro já tratado no hook
    }
  };

  const charPercent = Math.min((summaryValue.length / LIMITS.PROFESSIONAL_SUMMARY_MAX) * 100, 100);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-margin-mobile">
      <main className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-headline-md font-bold text-primary tracking-tight">
            CareerFlow
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-1 p-lg md:p-xl">
          {/* Progress Indicator */}
          <div className="flex flex-col items-center mb-xl">
            <span className="font-display text-label-md text-secondary mb-base">
              Passo 2 de 3
            </span>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary progress-step-active shadow-[0_0_12px_rgba(79,70,229,0.3)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            </div>
          </div>

          <div className="mb-lg">
            <h2 className="font-display text-headline-sm text-on-surface mb-xs">
              Resumo Profissional
            </h2>
            <p className="font-sans text-body-md text-on-surface-variant">
              Sua primeira impressão para os recrutadores. Destaque sua trajetória de forma impactante.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
            {/* Textarea */}
            <div className="flex flex-col gap-xs">
              <div className="flex items-center justify-between mb-xs">
                <label
                  htmlFor="professionalSummary"
                  className="font-display text-label-md font-bold text-on-surface"
                >
                  Conte sobre sua carreira
                </label>
                <div className="flex items-center gap-xs">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-label-sm font-display text-primary">
                    Sugestão por IA
                  </span>
                </div>
              </div>
              <div className="relative">
                <textarea
                  id="professionalSummary"
                  rows={8}
                  placeholder="Ex: Profissional com mais de 10 anos de experiência em gestão de produtos digitais, focado em metodologias ágeis e escalabilidade de SaaS..."
                  {...register('professionalSummary')}
                  onChange={(e) => {
                    register('professionalSummary').onChange(e);
                    setCharCount(e.target.value.length);
                  }}
                  className={`w-full p-md bg-white border rounded-lg text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-sans ${
                    errors.professionalSummary
                      ? 'border-error'
                      : 'border-outline-variant'
                  }`}
                />
                {/* Character Counter */}
                <div className="absolute bottom-md right-md flex flex-col items-end gap-xs">
                  <div className="flex items-center gap-base">
                    <div className="w-32 h-1 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          charCount < LIMITS.PROFESSIONAL_SUMMARY_MIN
                            ? 'bg-error'
                            : charCount > LIMITS.PROFESSIONAL_SUMMARY_MAX * 0.9
                              ? 'bg-emerald-500'
                              : 'bg-primary'
                        }`}
                        style={{ width: `${charPercent}%` }}
                      />
                    </div>
                    <span className="font-display text-label-sm text-on-surface-variant">
                      {charCount}/{LIMITS.PROFESSIONAL_SUMMARY_MAX}
                    </span>
                  </div>
                </div>
              </div>
              {errors.professionalSummary && (
                <p className="text-body-sm text-error">
                  {errors.professionalSummary.message}
                </p>
              )}
            </div>

            {/* Tips Section */}
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg">
              <div className="flex items-center gap-sm mb-md">
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-on-primary-container" />
                </div>
                <h3 className="font-display text-headline-sm font-bold text-on-surface">
                  Dicas
                </h3>
              </div>
              <ul className="flex flex-col gap-md">
                {tips.map((tip, index) => (
                  <li key={index} className="flex gap-sm">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <p className="font-sans text-body-sm text-on-surface-variant">
                      {tip.text}
                      <span className="font-bold text-on-surface">{tip.bold}</span>
                      {tip.end}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* ATS Preview */}
            <div className="bg-surface-container-lowest/50 border border-dashed border-outline-variant rounded-lg p-lg">
              <div className="flex justify-between items-start mb-sm">
                <span className="font-display text-label-sm text-outline font-bold uppercase tracking-wider">
                  Preview ATS
                </span>
                <div className="flex items-center gap-xs px-base py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-display text-label-sm">Otimizado</span>
                </div>
              </div>
              <div className="flex flex-col gap-sm">
                <div className="w-full h-3 bg-surface-container-high rounded" />
                <div className="w-4/5 h-3 bg-surface-container-high rounded" />
                <div className="w-5/6 h-3 bg-surface-container-high rounded" />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-lg flex flex-col gap-sm">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="w-full bg-primary text-white font-display text-label-md py-md rounded-lg hover:bg-surface-tint active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    SALVANDO...
                  </>
                ) : (
                  <>
                    PRÓXIMO
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <Link
                href={ROUTES.ONBOARDING_STEP3}
                className="w-full bg-transparent text-secondary font-display text-label-md py-md rounded-lg hover:bg-surface-container-low transition-colors text-center"
              >
                Pular
              </Link>
            </div>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="mt-lg flex justify-between items-center">
          <Link
            href={ROUTES.ONBOARDING_STEP1}
            className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-all font-display font-semibold group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Voltar
          </Link>
        </div>
      </main>
    </div>
  );
}