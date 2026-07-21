'use client';

import Link from 'next/link';
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  Plus,
} from 'lucide-react';
import { useDashboardInsights, useDashboardSkillsGap } from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ROUTES } from '@/lib/constants';

export default function InsightsPage() {
  const {
    data: insightsData,
    isLoading: insightsLoading,
    isError: insightsError,
    refetch: refetchInsights,
  } = useDashboardInsights();

  const {
    data: skillsGapData,
    isLoading: skillsGapLoading,
  } = useDashboardSkillsGap();

  if (insightsLoading) {
    return <LoadingState message="Carregando insights..." size="lg" />;
  }

  if (insightsError) {
    return (
      <ErrorState
        title="Erro ao carregar insights"
        message="Não foi possível carregar os insights do seu currículo."
        onRetry={() => refetchInsights()}
      />
    );
  }

  const insights = insightsData?.data;
  const skillsGap = skillsGapData?.data;

  return (
    <div className="flex flex-col gap-lg">
      <PageHeader
        title="Insights de Carreira"
        description="Análise inteligente do seu currículo com recomendações personalizadas."
      />

      {/* Se o perfil não tem dados suficientes */}
      {(!insights || insights.completionPercentage < 60) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-lg flex items-start gap-md">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-headline-sm text-amber-800">
              Perfil incompleto
            </h3>
            <p className="font-sans text-body-sm text-amber-700 mt-1">
              Complete seu perfil para receber insights mais precisos.
            </p>
            <Link
              href={ROUTES.PROFILE}
              className="inline-flex items-center gap-1 mt-2 font-display text-label-md text-amber-800 hover:underline"
            >
              Completar Perfil <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-gutter">
        {/* Strengths & Improvements */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
          {/* Forças */}
          {insights?.strengths && insights.strengths.length > 0 && (
            <div className="bg-white border border-outline-variant rounded-xl p-lg card-elevation-1">
              <div className="flex items-center gap-md mb-lg">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-display text-headline-sm text-on-surface">
                    Forças do seu Currículo
                  </h3>
                  <p className="font-sans text-body-sm text-secondary">
                    Pontos positivos identificados na análise
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-md">
                {insights.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-md p-md rounded-lg bg-emerald-50 border border-emerald-100"
                  >
                    <Sparkles className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-body-sm text-emerald-800">
                      {strength}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Oportunidades de Melhoria */}
          {insights?.improvements && insights.improvements.length > 0 && (
            <div className="bg-white border border-outline-variant rounded-xl p-lg card-elevation-1">
              <div className="flex items-center gap-md mb-lg">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display text-headline-sm text-on-surface">
                    Oportunidades de Melhoria
                  </h3>
                  <p className="font-sans text-body-sm text-secondary">
                    Áreas que podem ser aprimoradas
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-md">
                {insights.improvements.map((improvement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-md p-md rounded-lg bg-amber-50 border border-amber-100"
                  >
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-body-sm text-amber-800">
                      {improvement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendações */}
          {insights?.recommendations && insights.recommendations.length > 0 && (
            <div className="bg-white border border-outline-variant rounded-xl p-lg card-elevation-1">
              <div className="flex items-center gap-md mb-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-headline-sm text-on-surface">
                    Recomendações Personalizadas
                  </h3>
                  <p className="font-sans text-body-sm text-secondary">
                    Sugestões para melhorar seu currículo
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-md">
                {insights.recommendations.map((recommendation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-md p-md rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-body-sm text-on-surface">
                      {recommendation}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          {/* ATS Score */}
          {insights && (
            <div className="bg-gradient-to-br from-primary-container to-primary text-white p-lg rounded-xl flex flex-col gap-md shadow-xl">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-display text-label-sm opacity-80 uppercase tracking-widest">
                    Score ATS
                  </span>
                  <span className="font-display text-display-lg-mobile font-bold">
                    {insights.atsScore ?? '--'}/100
                  </span>
                </div>
                <Target className="h-8 w-8 opacity-20" />
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(insights.atsScore || 0, 100)}%` }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-label-sm opacity-80">
                  Completude: {insights.completionPercentage}%
                </span>
                <span className="font-display text-label-sm opacity-80">
                  {insights.canGenerateResume
                    ? '✅ Pode gerar currículo'
                    : '❌ Complete 60% para gerar currículo'}
                </span>
              </div>
            </div>
          )}

          {/* Skills Gap */}
          {skillsGap && !skillsGapLoading && (
            <div className="bg-white border border-outline-variant rounded-xl p-lg card-elevation-1">
              <h3 className="font-display text-headline-sm text-on-surface mb-lg">
                Gap de Habilidades
              </h3>

              {skillsGap.primaryCategory && (
                <div className="mb-md">
                  <span className="font-display text-label-sm text-secondary uppercase tracking-wider">
                    Categoria Principal
                  </span>
                  <div className="mt-1 inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full font-display text-label-sm">
                    {skillsGap.primaryCategory}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-md">
                <div>
                  <h4 className="font-display text-label-sm text-secondary uppercase tracking-wider mb-sm">
                    Suas Habilidades
                  </h4>
                  <div className="flex flex-wrap gap-sm">
                    {skillsGap.presentSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full font-display text-label-sm border border-emerald-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {skillsGap.presentSkills.length === 0 && (
                      <p className="font-sans text-body-sm text-secondary">
                        Nenhuma habilidade cadastrada.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-display text-label-sm text-secondary uppercase tracking-wider mb-sm">
                    Habilidades Recomendadas
                  </h4>
                  <div className="flex flex-wrap gap-sm">
                    {skillsGap.recommendedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full font-display text-label-sm border border-amber-200"
                      >
                        <Plus className="h-3 w-3" />
                        {skill}
                      </span>
                    ))}
                    {skillsGap.recommendedSkills.length === 0 && (
                      <p className="font-sans text-body-sm text-secondary">
                        Nenhuma recomendação disponível.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
