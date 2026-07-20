'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  Users,
  Download,
  Share2,
  ArrowUp,
  ArrowDown,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Edit3,
  PlusCircle,
  LogIn,
} from 'lucide-react';
import {
  useDashboardStats,
  useDashboardInsights,
  useDashboardActivity,
  useDashboardViewsChart,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { formatNumber, formatPercentage, formatDateTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

export default function DashboardPage() {
  const [selectedPeriod] = useState(30);

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useDashboardStats();

  const { data: insightsData } = useDashboardInsights();
  const { data: activityData } = useDashboardActivity(5);
  const { data: chartData } = useDashboardViewsChart(selectedPeriod);

  const stats = statsData?.data;

  if (statsLoading) {
    return <LoadingState message="Carregando dashboard..." size="lg" />;
  }

  if (statsError) {
    return (
      <ErrorState
        title="Erro ao carregar dashboard"
        message="Não foi possível carregar os dados do dashboard."
        onRetry={() => refetchStats()}
      />
    );
  }

  const kpiCards = [
    {
      label: 'Visualizações',
      value: stats?.totalViews ?? 0,
      change: 12,
      trend: 'up' as const,
      icon: Eye,
    },
    {
      label: 'Visitantes Únicos',
      value: stats?.uniqueViews ?? 0,
      change: 8,
      trend: 'up' as const,
      icon: Users,
    },
    {
      label: 'Downloads PDF',
      value: stats?.pdfDownloads ?? 0,
      change: -2,
      trend: 'down' as const,
      icon: Download,
    },
    {
      label: 'Compartilhamentos',
      value: stats?.sharesCount ?? 0,
      change: 4,
      trend: 'up' as const,
      icon: Share2,
    },
  ];

  const chartBars = chartData?.data?.dataPoints || generatePlaceholderBars(12);

  return (
    <div className="flex flex-col gap-lg">
      {/* Welcome Header */}
      <div className="flex flex-col gap-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-md">
          <div>
            <h1 className="font-display text-display-lg-mobile lg:text-display-lg text-on-surface">
              Painel de Performance
            </h1>
            <p className="font-sans text-body-lg text-secondary">
              Bem-vindo de volta, {stats?.completionPercentage ? 'Alex' : 'Usuário'}.
            </p>
          </div>
          <div className="flex gap-sm">
            <button className="flex items-center gap-xs bg-white border border-outline-variant px-md py-sm rounded-lg font-display text-label-md text-secondary hover:bg-surface-container-low transition-all">
              <Calendar className="h-5 w-5" />
              Últimos {selectedPeriod} dias
            </button>
          </div>
        </div>

        {/* Progresso do Currículo */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-md card-elevation-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-md">
            <div className="flex flex-col gap-xs">
              <span className="font-display text-headline-sm text-on-surface">
                Progresso do Currículo
              </span>
              <span className="font-display text-label-md text-primary font-bold">
                {formatPercentage(stats?.completionPercentage)} Concluído
              </span>
            </div>
            <div className="flex gap-lg">
              <div className="flex flex-col items-end">
                <span className="font-display text-label-sm text-secondary">
                  Mínimo para publicar
                </span>
                <span className="font-display text-label-md font-semibold">60%</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-display text-label-sm text-secondary">
                  Ideal ATS
                </span>
                <span className="font-display text-label-md font-semibold">80%</span>
              </div>
            </div>
          </div>
          {/* Progress Bar com marcadores */}
          <div className="relative w-full h-4 bg-surface-container-high rounded-full overflow-hidden">
            {/* Marcadores de Meta */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-on-surface/20 z-10"
              style={{ left: '60%' }}
              title="Mínimo para publicar"
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-on-surface/20 z-10"
              style={{ left: '80%' }}
              title="Ideal ATS"
            />
            {/* Barra de Progresso */}
            <div
              className="h-full bg-primary transition-all duration-700 ease-out rounded-full"
              style={{ width: `${Math.min(stats?.completionPercentage || 0, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-xs card-elevation-1 hover:border-primary/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="font-display text-label-md text-secondary">
                {kpi.label}
              </span>
              <kpi.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-display text-headline-md font-bold">
                {formatNumber(kpi.value)}
              </span>
              <span
                className={cn(
                  'font-display text-label-sm flex items-center gap-0.5 px-1 rounded',
                  kpi.trend === 'up'
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-red-600 bg-red-50'
                )}
              >
                {kpi.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {Math.abs(kpi.change)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Layout Content */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left Column (8 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
          {/* Gráfico de Visualizações */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-lg card-elevation-1">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-headline-sm text-on-surface">
                Fluxo de Visualizações
              </h3>
              <button className="text-primary font-display text-label-md flex items-center gap-xs hover:underline transition-all">
                <Download className="h-4 w-4" />
                Baixar relatório
              </button>
            </div>
            {/* Gráfico de Barras */}
            <div className="flex-grow flex items-end gap-2 h-[240px]">
              {chartBars.map((bar, index) => {
                const maxViews = Math.max(...chartBars.map((b) => b.views), 1);
                const heightPercent = (bar.views / maxViews) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >
                    <div className="w-full flex items-end justify-center h-[200px]">
                      <div
                        className="w-full bg-primary-container/20 rounded-t-sm hover:bg-primary transition-all cursor-pointer group-hover:bg-primary/80"
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                        title={`${bar.period}: ${bar.views} visualizações, ${bar.downloads} downloads`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Labels do Eixo X */}
            <div className="flex justify-between font-display text-label-sm text-outline">
              {chartBars.length > 0 && (
                <>
                  <span>{chartBars[0]?.period}</span>
                  <span>
                    {chartBars[Math.floor(chartBars.length / 2)]?.period}
                  </span>
                  <span>{chartBars[chartBars.length - 1]?.period}</span>
                </>
              )}
            </div>
          </div>

          {/* Status por Seção */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg card-elevation-1">
            <h3 className="font-display text-headline-sm text-on-surface mb-lg">
              Status por Seção
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {/* Concluído */}
              <div className="flex flex-col gap-sm">
                <h4 className="font-display text-label-sm text-secondary uppercase tracking-wider">
                  Concluído
                </h4>
                <ul className="flex flex-col gap-sm">
                  <li className="flex items-center justify-between p-sm rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="flex items-center gap-xs font-sans text-body-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      Informações de Contato
                    </span>
                    <span className="font-display text-label-sm">100%</span>
                  </li>
                  <li className="flex items-center justify-between p-sm rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="flex items-center gap-xs font-sans text-body-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      Formação Acadêmica
                    </span>
                    <span className="font-display text-label-sm">100%</span>
                  </li>
                </ul>
              </div>

              {/* Ações Necessárias */}
              <div className="flex flex-col gap-sm">
                <h4 className="font-display text-label-sm text-secondary uppercase tracking-wider">
                  Ações Necessárias
                </h4>
                <ul className="flex flex-col gap-sm">
                  <li className="flex items-center justify-between p-sm rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                    <span className="flex items-center gap-xs font-sans text-body-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Experiência Profissional
                    </span>
                    <Link
                      href={ROUTES.EXPERIENCES}
                      className="text-amber-800 underline font-display text-label-sm hover:text-amber-900"
                    >
                      Editar
                    </Link>
                  </li>
                  <li className="flex items-center justify-between p-sm rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                    <span className="flex items-center gap-xs font-sans text-body-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Competências Técnicas
                    </span>
                    <Link
                      href={ROUTES.SKILLS}
                      className="text-amber-800 underline font-display text-label-sm hover:text-amber-900"
                    >
                      Adicionar
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          {/* ATS Score Card */}
          <div className="bg-gradient-to-br from-primary-container to-primary text-white p-lg rounded-xl flex flex-col gap-md shadow-xl">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-display text-label-sm opacity-80 uppercase tracking-widest">
                  ATS Score
                </span>
                <span className="font-display text-display-lg-mobile font-bold">
                  {stats?.atsScore ?? '--'}/100
                </span>
              </div>
              <TrendingUp className="h-8 w-8 opacity-20" />
            </div>
            {/* Barra de Progresso */}
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(stats?.atsScore || 0, 100)}%` }}
              />
            </div>
            {/* Insights */}
            {insightsData?.data && (
              <div className="flex flex-col gap-sm">
                <div className="flex flex-col gap-xs">
                  <span className="font-display text-label-md text-white/90 flex items-center gap-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    Pontos Fortes
                  </span>
                  <p className="font-sans text-body-sm text-white/70 ml-6">
                    {insightsData.data.strengths[0] || 'Formatação otimizada e densidade de palavras-chave adequada.'}
                  </p>
                </div>
                <div className="flex flex-col gap-xs">
                  <span className="font-display text-label-md text-white/90 flex items-center gap-xs">
                    <AlertTriangle className="h-4 w-4" />
                    Melhorias
                  </span>
                  <p className="font-sans text-body-sm text-white/70 ml-6">
                    {insightsData.data.improvements[0] || 'Habilidades técnicas e Resumo precisam de métricas quantificáveis.'}
                  </p>
                </div>
              </div>
            )}
            <Link
              href={ROUTES.RESUME}
              className="mt-2 text-center font-display text-label-md border-t border-white/20 pt-md hover:underline transition-all"
            >
              Ver todas as sugestões
            </Link>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-lg card-elevation-1">
            <h3 className="font-display text-headline-sm text-on-surface">
              Atividades Recentes
            </h3>
            <div className="flex flex-col gap-md">
              {activityData?.data && activityData.data.length > 0 ? (
                activityData.data.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="p-md rounded-lg border border-outline-variant hover:border-primary/30 hover:bg-surface-container-lowest transition-all"
                  >
                    <div className="flex gap-md">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-body-sm font-semibold">
                          {activity.description}
                        </span>
                        <span className="font-display text-label-sm text-secondary">
                          {formatDateTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-lg">
                  <p className="font-sans text-body-sm text-secondary">
                    Nenhuma atividade recente.
                  </p>
                </div>
              )}
            </div>
            <button className="text-primary font-display text-label-md py-sm border border-primary/20 rounded-lg hover:bg-primary/5 transition-all">
              Ver Histórico Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Função auxiliar para ícone de atividade */
function getActivityIcon(action: string) {
  switch (action) {
    case 'experience_updated':
    case 'profile_updated':
      return <Edit3 className="h-5 w-5 text-primary" />;
    case 'skill_added':
      return <PlusCircle className="h-5 w-5 text-primary" />;
    case 'login':
      return <LogIn className="h-5 w-5 text-secondary" />;
    default:
      return <Edit3 className="h-5 w-5 text-primary" />;
  }
}

/* Placeholder para gráfico vazio */
function generatePlaceholderBars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    period: `${String(i + 1).padStart(2, '0')}/01`,
    views: Math.floor(Math.random() * 50) + 5,
    downloads: Math.floor(Math.random() * 10),
  }));
}