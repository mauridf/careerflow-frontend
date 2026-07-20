'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit3,
  History,
  UserCircle,
  Badge,
  BarChart3,
  Bolt,
  Verified,
  RefreshCw,
  ShieldBan,
  Trash2,
  TriangleAlert,
  Crown,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Calendar,
  Shield,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Eye,
  Download,
  Share2,
  Loader2,
} from 'lucide-react';
import {
  useAdminUserDetail,
  useUpdateUser,
  useToggleUserStatus,
  useManagePremium,
  useDeleteUser,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatDateTime, formatNumber } from '@/lib/formatters';
import { ROUTES } from '@/lib/constants';
import { UserRole } from '@/lib/enums';
import { cn } from '@/lib/utils';

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, refetch } = useAdminUserDetail(id);
  const updateUser = useUpdateUser();
  const toggleStatus = useToggleUserStatus();
  const managePremium = useManagePremium();
  const deleteUser = useDeleteUser();

  const [newRole, setNewRole] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [premiumAction, setPremiumAction] = useState<'activate' | 'deactivate'>('activate');

  const user = data?.data;

  if (isLoading) {
    return <LoadingState message="Carregando detalhes do usuário..." size="lg" />;
  }

  if (isError || !user) {
    return (
      <ErrorState
        title="Erro ao carregar usuário"
        message="Não foi possível carregar os dados do usuário."
        onRetry={() => refetch()}
      />
    );
  }

  const handleRoleUpdate = () => {
    if (newRole && newRole !== user.role) {
      updateUser.mutate({ id, data: { role: newRole } });
    }
  };

  const handlePremiumAction = () => {
    if (premiumAction === 'activate') {
      managePremium.mutate({ id, activate: true, until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() });
    } else {
      managePremium.mutate({ id, activate: false });
    }
    setShowPremiumDialog(false);
  };

  const roleColorMap: Record<string, string> = {
    Admin: 'bg-primary/10 text-primary',
    PremiumUser: 'bg-cyan-100/50 text-cyan-700',
    User: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="flex flex-col gap-lg">
      {/* Header & Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="flex items-center gap-md">
          <Link
            href={ROUTES.ADMIN_USERS}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-secondary" />
          </Link>
          <div>
            <h1 className="font-display text-headline-md text-on-surface">Detalhes do Usuário</h1>
            <p className="text-body-sm text-on-surface-variant">Visualizando registro de {user.name}</p>
          </div>
        </div>
        <div className="flex gap-base">
          <button className="flex items-center gap-xs px-md py-2.5 border border-outline-variant rounded-lg font-display text-label-md hover:bg-surface-container-low transition-all">
            <Edit3 className="h-[18px] w-[18px]" />
            Editar Perfil
          </button>
          <button className="flex items-center gap-xs px-md py-2.5 bg-primary text-white rounded-lg font-display text-label-md hover:opacity-90 transition-all">
            <History className="h-[18px] w-[18px]" />
            Logs de Acesso
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Column 1: Account & Profile */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Account Info */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-base mb-lg">
              <UserCircle className="h-6 w-6 text-primary" />
              <h2 className="font-display text-headline-sm">Informações da Conta</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-lg gap-x-xl">
              <div className="space-y-xs">
                <label className="font-display text-label-sm text-secondary">Nome Completo</label>
                <p className="text-body-md font-semibold">{user.name}</p>
              </div>
              <div className="space-y-xs">
                <label className="font-display text-label-sm text-secondary">E-mail</label>
                <div className="flex items-center gap-xs">
                  <p className="text-body-md">{user.email}</p>
                  {user.emailVerified && (
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 fill-current" />
                      VERIFICADO
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-xs">
                <label className="font-display text-label-sm text-secondary">Role</label>
                <div className="flex items-center gap-2">
                  <select
                    value={newRole || user.role}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="User">Usuário</option>
                    <option value="PremiumUser">Usuário Premium</option>
                    <option value="Admin">Administrador</option>
                  </select>
                  {newRole && newRole !== user.role && (
                    <button
                      onClick={handleRoleUpdate}
                      disabled={updateUser.isPending}
                      className="bg-primary text-on-primary px-4 py-2 rounded-lg font-display text-label-sm hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {updateUser.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Salvar'
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-xs">
                <label className="font-display text-label-sm text-secondary">Status</label>
                <div className="flex items-center gap-xs">
                  <span className={cn('w-2.5 h-2.5 rounded-full animate-pulse', user.isActive ? 'bg-emerald-500' : 'bg-red-500')} />
                  <p className="text-body-md">{user.isActive ? 'Ativo' : 'Inativo'}</p>
                </div>
              </div>

              {/* Premium Card */}
              <div className="md:col-span-2 p-md bg-primary-container/10 border border-primary/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-base">
                    <Crown className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-display text-label-md text-primary font-bold">
                        {user.isPremium ? 'Assinatura Premium' : 'Plano Gratuito'}
                      </p>
                      {user.premiumUntil && (
                        <p className="text-body-sm text-on-surface-variant">
                          Válido até {formatDateTime(user.premiumUntil)}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { setPremiumAction(user.isPremium ? 'deactivate' : 'activate'); setShowPremiumDialog(true); }}
                    className="text-primary font-display text-label-md hover:underline"
                  >
                    {user.isPremium ? 'Desativar Premium' : 'Ativar Premium'}
                  </button>
                </div>
              </div>

              <div className="space-y-xs">
                <label className="font-display text-label-sm text-secondary">Último Login</label>
                <p className="text-body-sm">{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Nunca'}</p>
              </div>
              <div className="space-y-xs">
                <label className="font-display text-label-sm text-secondary">Tentativas Falhas</label>
                <p className={cn('text-body-sm', user.failedLoginAttempts > 0 ? 'text-error' : '')}>
                  {user.failedLoginAttempts} tentativa{user.failedLoginAttempts !== 1 ? 's' : ''}
                  {user.lockedUntil ? ` (Bloqueado até ${formatDateTime(user.lockedUntil)})` : ''}
                </p>
              </div>
              <div className="space-y-xs md:col-span-2">
                <label className="font-display text-label-sm text-secondary">Criado em</label>
                <p className="text-body-sm">{formatDateTime(user.createdAt)}</p>
              </div>
            </div>
          </section>

          {/* Professional Profile */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-base">
                <Badge className="h-6 w-6 text-primary" />
                <h2 className="font-display text-headline-sm">Perfil Profissional</h2>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-display text-label-sm text-secondary">Completude do Perfil</span>
                <span className="font-display text-headline-sm text-primary">
                  {user.hasProfile ? '85%' : '0%'}
                </span>
              </div>
            </div>
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden mb-lg">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                style={{ width: user.hasProfile ? '85%' : '0%' }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="space-y-xs">
                <label className="font-display text-label-sm text-secondary">Cidade</label>
                <p className="text-body-md">{user.hasProfile ? 'São Paulo, SP' : '—'}</p>
              </div>
              <div className="space-y-xs">
                <label className="font-display text-label-sm text-secondary">Perfil Completo</label>
                <p className="text-body-md">{user.hasProfile ? 'Sim' : 'Não'}</p>
              </div>
              <div className="space-y-xs">
                <label className="font-display text-label-sm text-secondary">Slug do Currículo</label>
                <div className="flex items-center gap-xs text-primary font-display text-label-md">
                  <span>{user.hasProfile ? '/curriculo-slug' : '—'}</span>
                  {user.hasProfile && <ExternalLink className="h-4 w-4 cursor-pointer" />}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Column 2: Stats & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* Stats */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-base mb-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h2 className="font-display text-headline-sm">Estatísticas</h2>
            </div>
            <div className="grid grid-cols-2 gap-md">
              <div className="bg-surface-container-low p-md rounded-lg text-center border border-outline-variant/30">
                <p className="text-2xl font-bold font-display text-on-surface">{formatNumber(user.hasProfile ? 247 : 0)}</p>
                <p className="font-display text-label-sm text-secondary uppercase tracking-wider">Views</p>
              </div>
              <div className="bg-surface-container-low p-md rounded-lg text-center border border-outline-variant/30">
                <p className="text-2xl font-bold font-display text-on-surface">{formatNumber(user.hasProfile ? 45 : 0)}</p>
                <p className="font-display text-label-sm text-secondary uppercase tracking-wider">Downloads</p>
              </div>
              <div className="bg-surface-container-low p-md rounded-lg text-center border border-outline-variant/30">
                <p className="text-2xl font-bold font-display text-on-surface">{formatNumber(user.hasProfile ? 12 : 0)}</p>
                <p className="font-display text-label-sm text-secondary uppercase tracking-wider">Shares</p>
              </div>
              <div className="bg-primary/5 p-md rounded-lg text-center border border-primary/20">
                <p className="text-2xl font-bold font-display text-primary">
                  {user.hasProfile ? '72' : '—'}
                  <span className="text-label-md">/100</span>
                </p>
                <p className="font-display text-label-sm text-primary uppercase tracking-wider">Score ATS</p>
              </div>
            </div>
            <div className="mt-md pt-md border-t border-outline-variant">
              <button className="w-full text-center font-display text-label-md text-primary hover:bg-primary/5 py-3 rounded-lg transition-all">
                Ver relatório completo
              </button>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-base mb-lg">
              <Bolt className="h-6 w-6 text-primary" />
              <h2 className="font-display text-headline-sm">Ações Rápidas</h2>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setPremiumAction('activate'); setShowPremiumDialog(true); }}
                className="w-full flex items-center justify-between px-md py-3 border border-outline-variant rounded-lg font-display text-label-md hover:bg-surface-container-low transition-all"
              >
                <span className="flex items-center gap-3">
                  <Verified className="h-5 w-5 text-primary" />
                  {user.isPremium ? 'Gerenciar Premium' : 'Ativar Premium'}
                </span>
                <ChevronRight className="h-[18px] w-[18px] text-secondary" />
              </button>
              <button
                onClick={() => toggleStatus.mutate(id)}
                disabled={toggleStatus.isPending}
                className="w-full flex items-center justify-between px-md py-3 border border-outline-variant rounded-lg font-display text-label-md hover:bg-surface-container-low transition-all disabled:opacity-50"
              >
                <span className="flex items-center gap-3">
                  <ShieldBan className="h-5 w-5 text-secondary" />
                  {user.isActive ? 'Desativar Conta' : 'Ativar Conta'}
                </span>
                {toggleStatus.isPending ? (
                  <Loader2 className="h-[18px] w-[18px] animate-spin" />
                ) : (
                  <ChevronRight className="h-[18px] w-[18px] text-secondary" />
                )}
              </button>
            </div>

            {/* Critical Action */}
            <div className="mt-xl pt-lg border-t border-error-container/50">
              <div className="bg-error-container/10 p-md rounded-lg border border-error/10 mb-md">
                <div className="flex items-center gap-2 mb-xs text-error">
                  <TriangleAlert className="h-5 w-5" />
                  <span className="font-display text-label-md font-bold">Ação Crítica</span>
                </div>
                <p className="text-body-sm text-error/80 leading-tight">
                  Excluir este usuário removerá todos os dados permanentemente. Esta ação é irreversível.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-full flex items-center justify-center gap-2 px-md py-3 bg-error text-white rounded-lg font-display text-label-md hover:opacity-90 transition-all shadow-lg shadow-error/20"
              >
                <Trash2 className="h-5 w-5" />
                Excluir Usuário
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Premium Dialog */}
      <ConfirmDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
        title={premiumAction === 'activate' ? 'Ativar Premium' : 'Desativar Premium'}
        description={
          premiumAction === 'activate'
            ? `Tem certeza que deseja ativar o Premium para "${user.name}"?`
            : `Tem certeza que deseja desativar o Premium de "${user.name}"?`
        }
        confirmLabel={premiumAction === 'activate' ? 'Ativar' : 'Desativar'}
        variant={premiumAction === 'activate' ? 'default' : 'destructive'}
        onConfirm={handlePremiumAction}
        loading={managePremium.isPending}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Excluir Usuário"
        description={`Tem certeza que deseja excluir permanentemente "${user.name}"? Todos os dados associados serão removidos.`}
        confirmLabel="Excluir Permanentemente"
        variant="destructive"
        onConfirm={() => deleteUser.mutate(id)}
        loading={deleteUser.isPending}
      />
    </div>
  );
}
