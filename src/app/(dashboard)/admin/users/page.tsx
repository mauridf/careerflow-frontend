'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  UserPlus,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdminUsers, useDeleteUser, useToggleUserStatus } from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatNumber, formatDateTime, getInitials } from '@/lib/formatters';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const ROLE_OPTIONS = ['Todos', 'Admin', 'PremiumUser', 'User'] as const;
const STATUS_OPTIONS = ['Todos', 'Ativo', 'Inativo'] as const;
const PREMIUM_OPTIONS = ['Todos', 'Sim', 'Não'] as const;

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [premiumFilter, setPremiumFilter] = useState('Todos');

  const params: { page?: number; pageSize?: number; search?: string } = { page, pageSize: 20 };
  if (search) params.search = search;

  const { data, isLoading, isError, refetch } = useAdminUsers(params);
  const deleteUser = useDeleteUser();
  const toggleStatus = useToggleUserStatus();

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false, id: '', name: '',
  });

  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleDelete = () => {
    deleteUser.mutate(deleteDialog.id);
    setDeleteDialog({ open: false, id: '', name: '' });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return { label: 'Admin', className: 'bg-primary/10 text-primary' };
      case 'PremiumUser':
        return { label: 'Prem', className: 'bg-cyan-100/50 text-cyan-700' };
      default:
        return { label: 'User', className: 'bg-slate-100 text-slate-600' };
    }
  };

  const getInitialsBg = (name: string) => {
    const colors = [
      'bg-primary-fixed text-primary',
      'bg-secondary-container text-on-secondary-container',
      'bg-surface-container-high text-secondary',
      'bg-primary-container text-white',
    ];
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (isLoading) {
    return <LoadingState message="Carregando usuários..." size="lg" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar usuários"
        message="Não foi possível carregar a lista de usuários."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-headline-md text-on-surface">Gerenciamento de Usuários</h1>
          <p className="text-body-sm text-secondary">Visualize e administre todos os membros da plataforma.</p>
        </div>
        <button className="bg-primary text-on-primary px-lg py-2.5 rounded-lg font-display text-label-md flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-sm">
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </button>
      </div>

      {/* Filters */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-md items-end">
          <div className="lg:col-span-2">
            <label className="block font-display text-label-sm text-on-surface-variant mb-2">Pesquisa</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Pesquisar por nome ou email..."
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm outline-none transition-all bg-surface-container-lowest"
              />
            </div>
          </div>
          <div>
            <label className="block font-display text-label-sm text-on-surface-variant mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm bg-surface-container-lowest outline-none transition-all"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt === 'PremiumUser' ? 'Premium' : opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-display text-label-sm text-on-surface-variant mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm bg-surface-container-lowest outline-none transition-all"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-display text-label-sm text-on-surface-variant mb-2">Premium</label>
            <select
              value={premiumFilter}
              onChange={(e) => { setPremiumFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm bg-surface-container-lowest outline-none transition-all"
            >
              {PREMIUM_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSearch(''); setRoleFilter('Todos'); setStatusFilter('Todos'); setPremiumFilter('Todos'); setPage(1); }}
              className="bg-surface-container-high text-on-secondary-container px-4 py-2 rounded-lg font-display text-label-md hover:bg-surface-variant transition-colors flex-1"
            >
              Limpar
            </button>
          </div>
        </div>
      </section>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-4 font-display text-label-sm text-secondary uppercase tracking-wider">Nome</th>
                <th className="px-lg py-4 font-display text-label-sm text-secondary uppercase tracking-wider">Email</th>
                <th className="px-lg py-4 font-display text-label-sm text-secondary uppercase tracking-wider">Role</th>
                <th className="px-lg py-4 font-display text-label-sm text-secondary uppercase tracking-wider">Status</th>
                <th className="px-lg py-4 font-display text-label-sm text-secondary uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-lg py-16 text-center">
                    <p className="text-body-sm text-secondary">Nenhum usuário encontrado.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-lg py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm', getInitialsBg(user.name))}>
                            {getInitials(user.name)}
                          </div>
                          <span className="font-display text-label-md text-on-surface">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-lg py-4 text-body-sm text-secondary">{user.email}</td>
                      <td className="px-lg py-4">
                        <span className={cn('px-3 py-1 rounded-full text-label-sm font-display', roleBadge.className)}>
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="px-lg py-4">
                        <div className={cn('flex items-center gap-2', user.isActive ? 'text-emerald-600' : 'text-secondary/50')}>
                          {user.isActive ? (
                            <CheckCircle className="h-[18px] w-[18px]" />
                          ) : (
                            <XCircle className="h-[18px] w-[18px]" />
                          )}
                          <span className="text-label-sm">{user.isActive ? 'Ativo' : 'Inativo'}</span>
                        </div>
                      </td>
                      <td className="px-lg py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`${ROUTES.ADMIN_USERS}/${user.id}`}
                            className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors"
                            title="Ver"
                          >
                            <Eye className="h-[20px] w-[20px]" />
                          </Link>
                          <Link
                            href={`${ROUTES.ADMIN_USERS}/${user.id}`}
                            className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="h-[20px] w-[20px]" />
                          </Link>
                          <button
                            onClick={() => toggleStatus.mutate(user.id)}
                            className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors"
                            title={user.isActive ? 'Desativar' : 'Ativar'}
                          >
                            {toggleStatus.isPending ? (
                              <Loader2 className="h-[20px] w-[20px] animate-spin" />
                            ) : (
                              <RefreshCw className="h-[20px] w-[20px]" />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteDialog({ open: true, id: user.id, name: user.name })}
                            className="p-2 hover:bg-error-container hover:text-error rounded-lg text-secondary transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-[20px] w-[20px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="px-lg py-4 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-container-lowest">
            <p className="text-body-sm text-secondary">
              Mostrando {Math.min((page - 1) * pageSize + 1, total)} a {Math.min(page * pageSize, total)} de {formatNumber(total)} usuários
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="h-[20px] w-[20px]" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        'w-10 h-10 rounded-lg font-display text-label-md transition-colors',
                        page === pageNum
                          ? 'bg-primary text-on-primary'
                          : 'hover:bg-surface-container-low text-secondary'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-40"
              >
                <ChevronRight className="h-[20px] w-[20px]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="Excluir Usuário"
        description={`Tem certeza que deseja excluir "${deleteDialog.name}"? Esta ação removerá todos os dados permanentemente.`}
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleteUser.isPending}
      />
    </div>
  );
}
