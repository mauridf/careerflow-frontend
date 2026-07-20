'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Globe,
  Save,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import {
  useLanguages,
  useCreateLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { LanguageLevel } from '@/lib/enums';
import { ROUTES, LIMITS } from '@/lib/constants';

interface LanguageFormData {
  languageName: string;
  proficiencyLevel: number;
  isNative: boolean;
}

const initialFormData: LanguageFormData = {
  languageName: '',
  proficiencyLevel: 1,
  isNative: false,
};

export default function LanguagesPage() {
  const { data: languagesData, isLoading, isError, refetch } = useLanguages();
  const createLanguage = useCreateLanguage();
  const updateLanguage = useUpdateLanguage();
  const deleteLanguage = useDeleteLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LanguageFormData>(initialFormData);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    label: string;
  }>({ open: false, id: '', label: '' });

  const languages = languagesData?.data || [];

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lang: (typeof languages)[0]) => {
    const levelIndex = Object.values(LanguageLevel).findIndex(
      (l) => l.label === lang.proficiencyLevel
    );
    setFormData({
      languageName: lang.languageName,
      proficiencyLevel: levelIndex >= 0 ? levelIndex : 1,
      isNative: lang.isNative,
    });
    setEditingId(lang.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.languageName.trim()) return;

    const payload = {
      languageName: formData.languageName.trim(),
      proficiencyLevel: formData.isNative ? 6 : formData.proficiencyLevel,
      isNative: formData.isNative,
    };

    try {
      if (editingId) {
        await updateLanguage.mutateAsync({ id: editingId, data: payload });
      } else {
        await createLanguage.mutateAsync(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      // Erro já tratado no hook
    }
  };

  const handleDelete = () => {
    deleteLanguage.mutate(deleteDialog.id);
    setDeleteDialog({ open: false, id: '', label: '' });
  };

  const getLevelColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 65) return 'bg-primary';
    if (score >= 45) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  if (isLoading) {
    return <LoadingState message="Carregando idiomas..." size="lg" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar idiomas"
        message="Não foi possível carregar a lista de idiomas."
        onRetry={() => refetch()}
      />
    );
  }

  const isSaving = createLanguage.isPending || updateLanguage.isPending;

  return (
    <div className="flex flex-col gap-lg">
      <PageHeader
        title="Idiomas"
        description={`Gerencie seus idiomas e níveis de proficiência. (${languages.length}/${LIMITS.LANGUAGES_MAX})`}
      >
        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Adicionar Idioma
        </button>
      </PageHeader>

      {/* Lista de Idiomas */}
      {languages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1 hover:border-primary/30 transition-all group flex items-center gap-lg"
            >
              {/* Ícone */}
              <div className="h-12 w-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                {lang.isNative ? '🏠' : '🌐'}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <h4 className="font-display text-label-md font-bold text-on-surface flex items-center gap-sm">
                      {lang.languageName}
                      {lang.isNative && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase font-display">
                          Nativo
                        </span>
                      )}
                    </h4>
                    <p className="font-sans text-body-sm text-on-surface-variant">
                      {lang.proficiencyLevel}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-sm opacity-0 group-hover:opacity-100 transition-all shrink-0">
                    <button
                      onClick={() => handleOpenEdit(lang)}
                      className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          id: lang.id,
                          label: lang.languageName,
                        })
                      }
                      className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-container transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Barra de Proficiência */}
                <div className="mt-3">
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getLevelColor(lang.proficiencyScore)}`}
                      style={{ width: `${lang.proficiencyScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-secondary font-display">A1</span>
                    <span className="text-[10px] text-secondary font-display">C2</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Globe}
          title="Nenhum idioma cadastrado"
          description="Adicione os idiomas que você domina."
          actionLabel="Adicionar Idioma"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-outline-variant flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <header className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div>
                <h2 className="font-display text-headline-md text-on-surface">
                  {editingId ? 'Editar Idioma' : 'Adicionar Idioma'}
                </h2>
                <p className="font-sans text-body-sm text-on-surface-variant">
                  Configure os detalhes e níveis de proficiência.
                </p>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
              >
                <X className="h-5 w-5 text-secondary" />
              </button>
            </header>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-lg overflow-y-auto custom-scrollbar flex-1 space-y-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-base">
                  <label className="font-display text-label-md text-on-surface">
                    Nome do Idioma
                  </label>
                  <input
                    type="text"
                    value={formData.languageName}
                    onChange={(e) => setFormData({ ...formData, languageName: e.target.value })}
                    placeholder="Ex: Inglês, Alemão..."
                    maxLength={50}
                    className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-body-md"
                  />
                </div>
                <div className="flex flex-col gap-base">
                  <label className="font-display text-label-md text-on-surface">
                    Nível de Proficiência
                  </label>
                  <select
                    value={formData.proficiencyLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, proficiencyLevel: Number(e.target.value) })
                    }
                    disabled={formData.isNative}
                    className="w-full h-12 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-body-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {Object.entries(LanguageLevel).map(([key, level]) => (
                      <option key={key} value={Number(key)}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Native Toggle */}
              <label className="flex items-center gap-md group cursor-pointer w-fit">
                <div className="relative w-12 h-6 bg-surface-container-highest rounded-full transition-colors group-hover:bg-outline-variant flex items-center px-1">
                  <input
                    type="checkbox"
                    checked={formData.isNative}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isNative: e.target.checked,
                        proficiencyLevel: e.target.checked ? 6 : formData.proficiencyLevel,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-6 peer-checked:bg-primary" />
                </div>
                <span className="font-display text-label-md text-on-surface">
                  Este é o meu idioma nativo
                </span>
              </label>

              {/* Preview */}
              <div className="bg-surface-container-low border border-dashed border-primary/30 p-md rounded-lg">
                <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-xs font-display">
                  Visualização para Recrutadores
                </p>
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold font-display">
                    {formData.languageName ? formData.languageName.slice(0, 2).toUpperCase() : '--'}
                  </div>
                  <div>
                    <p className="font-display text-label-md font-bold text-on-surface">
                      {formData.languageName || 'Idioma'} —{' '}
                      {formData.isNative
                        ? 'Nativo'
                        : LanguageLevel[formData.proficiencyLevel]?.label || '--'}
                    </p>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <footer className="p-lg border-t border-outline-variant bg-surface-container-lowest flex justify-end items-center gap-md">
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="px-xl py-md font-display text-label-md text-secondary hover:bg-surface-container-high rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving || !formData.languageName.trim()}
                className="px-xl py-md font-display text-label-md bg-primary text-on-primary rounded-lg font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
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
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}