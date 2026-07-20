'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Link2,
  Globe,
  ExternalLink,
  Save,
  Loader2,
  X,
  GripVertical,
} from 'lucide-react';

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
import {
  useSocialNetworks,
  useCreateSocialNetwork,
  useUpdateSocialNetwork,
  useDeleteSocialNetwork,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { SocialNetworkType } from '@/lib/enums';
import { ROUTES, LIMITS } from '@/lib/constants';

interface SocialNetworkFormData {
  networkType: number;
  url: string;
  displayOrder: number;
}

const initialFormData: SocialNetworkFormData = {
  networkType: 0,
  url: '',
  displayOrder: 0,
};

const networkIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  0: Linkedin,
  1: Github,
  2: Globe, // GitLab
  3: Instagram,
  4: Facebook,
  5: Twitter,
  6: Youtube,
  7: Globe, // Portfolio
  8: Link2, // Other
};

const networkColors: Record<number, string> = {
  0: 'bg-blue-100 text-blue-700',
  1: 'bg-gray-100 text-gray-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-pink-100 text-pink-700',
  4: 'bg-blue-100 text-blue-700',
  5: 'bg-sky-100 text-sky-700',
  6: 'bg-red-100 text-red-700',
  7: 'bg-purple-100 text-purple-700',
  8: 'bg-slate-100 text-slate-700',
};

export default function SocialNetworksPage() {
  const { data: socialNetworksData, isLoading, isError, refetch } = useSocialNetworks();
  const createSocialNetwork = useCreateSocialNetwork();
  const updateSocialNetwork = useUpdateSocialNetwork();
  const deleteSocialNetwork = useDeleteSocialNetwork();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SocialNetworkFormData>(initialFormData);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    label: string;
  }>({ open: false, id: '', label: '' });

  const socialNetworks = socialNetworksData?.data || [];

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    const maxOrder = socialNetworks.length > 0 ? Math.max(...socialNetworks.map((s) => s.displayOrder)) : 0;
    setFormData({ ...initialFormData, displayOrder: maxOrder + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sn: (typeof socialNetworks)[0]) => {
    const typeIndex = Object.values(SocialNetworkType).indexOf(sn.networkType);
    setFormData({
      networkType: typeIndex >= 0 ? typeIndex : 8,
      url: sn.url,
      displayOrder: sn.displayOrder,
    });
    setEditingId(sn.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url.trim() || !formData.url.startsWith('http')) return;

    const payload = {
      networkType: formData.networkType,
      url: formData.url.trim(),
      displayOrder: formData.displayOrder,
    };

    try {
      if (editingId) {
        await updateSocialNetwork.mutateAsync({ id: editingId, data: payload });
      } else {
        await createSocialNetwork.mutateAsync(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      // Erro já tratado no hook
    }
  };

  const handleDelete = () => {
    deleteSocialNetwork.mutate(deleteDialog.id);
    setDeleteDialog({ open: false, id: '', label: '' });
  };

  const getIcon = (type: string, index: number) => {
    const typeIndex = Object.values(SocialNetworkType).indexOf(type);
    const Icon = networkIcons[typeIndex >= 0 ? typeIndex : 8] || Link2;
    return <Icon className="h-5 w-5" />;
  };

  const getColorClass = (type: string) => {
    const typeIndex = Object.values(SocialNetworkType).indexOf(type);
    return networkColors[typeIndex >= 0 ? typeIndex : 8] || 'bg-slate-100 text-slate-700';
  };

  if (isLoading) {
    return <LoadingState message="Carregando redes sociais..." size="lg" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar redes sociais"
        message="Não foi possível carregar a lista de redes sociais."
        onRetry={() => refetch()}
      />
    );
  }

  const isSaving = createSocialNetwork.isPending || updateSocialNetwork.isPending;

  return (
    <div className="flex flex-col gap-lg">
      <PageHeader
        title="Redes Sociais"
        description={`Adicione links para seus perfis profissionais. (${socialNetworks.length}/${LIMITS.SOCIAL_NETWORKS_MAX})`}
      >
        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Adicionar Rede Social
        </button>
      </PageHeader>

      {/* Lista de Redes Sociais */}
      {socialNetworks.length > 0 ? (
        <div className="flex flex-col gap-md">
          {socialNetworks.map((sn) => (
            <div
              key={sn.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex items-center gap-lg shadow-level-1 hover:border-primary/30 transition-all group"
            >
              {/* Ícone da Rede */}
              <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${getColorClass(sn.networkType)}`}>
                {getIcon(sn.networkType, 0)}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <h4 className="font-display text-label-md font-bold text-on-surface">
                      {sn.networkType}
                    </h4>
                    <a
                      href={sn.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-body-sm text-primary hover:underline truncate block max-w-[300px]"
                    >
                      {sn.url}
                    </a>
                  </div>

                  <div className="flex items-center gap-sm">
                    <span className="bg-surface-container-highest px-base py-xs rounded text-label-sm text-on-secondary-fixed-variant font-display">
                      Ordem {sn.displayOrder}
                    </span>
                    {/* Actions */}
                    <div className="flex items-center gap-xs opacity-0 group-hover:opacity-100 transition-all">
                      <a
                        href={sn.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                        title="Abrir link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(sn)}
                        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            id: sn.id,
                            label: sn.networkType,
                          })
                        }
                        className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-container transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Link2}
          title="Nenhuma rede social adicionada"
          description="Adicione links para seus perfis profissionais como LinkedIn e GitHub."
          actionLabel="Adicionar Rede Social"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-outline-variant flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <div className="flex flex-col">
                <h2 className="font-display text-headline-sm text-on-surface">
                  {editingId ? 'Editar Rede Social' : 'Adicionar Rede Social'}
                </h2>
                <p className="font-sans text-body-sm text-on-surface-variant">
                  Adicione links para seus perfis profissionais
                </p>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="p-xs rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-lg overflow-y-auto custom-scrollbar space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* Network Type */}
                <div className="flex flex-col gap-xs">
                  <label className="font-display text-label-md text-on-secondary-fixed-variant">
                    Tipo de Rede
                  </label>
                  <div className="relative">
                    <select
                      value={formData.networkType}
                      onChange={(e) =>
                        setFormData({ ...formData, networkType: Number(e.target.value) })
                      }
                      className="w-full bg-white border border-outline-variant rounded-lg px-md py-base text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none transition-all cursor-pointer font-sans"
                    >
                      {Object.entries(SocialNetworkType).map(([key, label]) => (
                        <option key={key} value={Number(key)}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                {/* Order */}
                <div className="flex flex-col gap-xs">
                  <label className="font-display text-label-md text-on-secondary-fixed-variant">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: Number(e.target.value) })
                    }
                    placeholder="Ex: 1"
                    min={0}
                    className="w-full bg-white border border-outline-variant rounded-lg px-md py-base text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                  />
                </div>
              </div>

              {/* URL */}
              <div className="flex flex-col gap-xs">
                <label className="font-display text-label-md text-on-secondary-fixed-variant">
                  URL do Perfil
                </label>
                <div className="relative flex items-center">
                  <Link2 className="absolute left-3 h-5 w-5 text-on-surface-variant" />
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://linkedin.com/in/usuario"
                    className="w-full bg-white border border-outline-variant rounded-lg pl-10 pr-md py-base text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="px-lg py-md border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-md">
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="px-lg py-base rounded-lg font-display text-label-md text-secondary hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving || !formData.url.trim() || !formData.url.startsWith('http')}
                className="px-lg py-base rounded-lg font-display text-label-md bg-primary text-on-primary hover:opacity-90 transition-all shadow-sm flex items-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}