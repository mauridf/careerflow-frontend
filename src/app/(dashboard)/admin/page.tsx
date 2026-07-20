'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Crown,
  Shield,
  FileText,
  Globe,
  Eye,
  TrendingUp,
  BarChart3,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Download,
} from 'lucide-react';
import { useAdminStats } from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { formatNumber, formatDateTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

export default function AdminDashboardPage() {
  const { data: statsData, isLoading, isError, refetch } = useAdminStats();

  if (isLoading) {
    return <LoadingState message="Carregando painel administrativo..." size="lg" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar estatísticas"
        message="Não foi possível carregar os dados do painel administrativo."
        onRetry={() => refetch()}
      />
    );
  }

  const stats = statsData?.data;

  const kpiCards = [
    { label: 'Total de Usuários', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-blue-600 bg-blue-50', change: 12, trend: 'up' as const },
    { label: 'Usuários Ativos', value: stats?.activeUsers ?? 0, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50', change: 5.2, trend: 'up' as const },
    { label: 'Premium', value: stats?.premiumUsers ?? 0, icon: Crown, color: 'text-amber-600 bg-amber-50', change: 8, trend: 'up' as const },
    { label: 'Admins', value: stats?.adminUsers ?? 0, icon: Shield, color: 'text-purple-600 bg-purple-50', change: 0, trend: 'up' as const },
    { label: 'Resumos Criados', value: stats?.totalResumes ?? 0, icon: FileText, color: 'text-cyan-600 bg-cyan-50', change: 18, trend: 'up' as const },
    { label: 'Publicados', value: stats?.publishedResumes ?? 0, icon: Globe, color: 'text-indigo-600 bg-indigo-50', change: -2, trend: 'down' as const },
    { label: 'Visualizações', value: stats?.totalResumeViews ?? 0, icon: Eye, color: 'text-rose-600 bg-rose-50', change: 24, trend: 'up' as const },
    { label: 'Média Score ATS', value: stats?.averageAtsScore ?? 0, icon: TrendingUp, color: 'text-teal-600 bg-teal-50', change: 0, trend: 'up' as const, suffix: '%' },
  ];

  return (
    <div className="flex flex-col gap-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-headline-md text-slate-900 font-display">Painel Administrativo</h1>
          <p className="text-body-sm text-slate-500">Visão geral do sistema CareerFlow</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.ADMIN_USERS}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-display text-label-md hover:opacity-90 transition-all"
          >
            <Users className="h-4 w-4" />
            Gerenciar Usuários
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-outline-variant rounded-xl p-lg hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', kpi.color)}>
                <kpi.icon className="h-5 w-5" />
              </div>
              {kpi.change !== 0 && (
                <span className={cn(
                  'inline-flex items-center gap-0.5 text-label-sm font-display',
                  kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {kpi.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(kpi.change)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">
              {typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value}
              {kpi.suffix}
            </p>
            <p className="text-label-sm text-slate-500 font-display mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Growth Chart Placeholder */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-xl p-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-label-md font-semibold text-slate-900">Crescimento de Usuários</h3>
            <span className="text-label-sm text-slate-400">Últimos 30 dias</span>
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <BarChart3 className="h-12 w-12 text-slate-300" />
            <span className="text-body-sm text-slate-400 ml-3">Gráfico de crescimento</span>
          </div>
        </div>

        {/* ATS Score Distribution */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg">
          <h3 className="font-display text-label-md font-semibold text-slate-900 mb-4">Distribuição de Scores ATS</h3>
          <div className="space-y-4">
            {[
              { range: '0-20', value: 15, color: 'bg-red-400' },
              { range: '21-40', value: 25, color: 'bg-orange-400' },
              { range: '41-60', value: 35, color: 'bg-yellow-400' },
              { range: '61-80', value: 55, color: 'bg-lime-400' },
              { range: '81-100', value: 20, color: 'bg-emerald-400' },
            ].map((bar) => (
              <div key={bar.range}>
                <div className="flex justify-between text-label-sm text-slate-600 font-display mb-1">
                  <span>{bar.range}</span>
                  <span>{bar.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all', bar.color)} style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
        <Link
          href={ROUTES.ADMIN_USERS}
          className="bg-white border border-outline-variant rounded-xl p-lg flex items-center justify-between hover:border-primary/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-label-md font-semibold text-slate-900">Gerenciar Usuários</h3>
              <p className="text-body-sm text-slate-500">Visualizar, editar e gerenciar usuários</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
        </Link>

        <div className="bg-white border border-outline-variant rounded-xl p-lg flex items-center justify-between hover:border-primary/30 transition-all group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Download className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display text-label-md font-semibold text-slate-900">Exportar Relatório</h3>
              <p className="text-body-sm text-slate-500">Baixar relatório completo do sistema</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </div>
  );
}
