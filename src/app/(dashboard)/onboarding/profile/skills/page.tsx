'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  GripVertical,
  Loader2,
  X,
  ArrowUp,
  ArrowDown,
  Save,
  Award,
  Bolt,
} from 'lucide-react';
import {
  useSkills,
  useSkillCategories,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
  useReorderSkills,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { SkillCategory, ProficiencyLevel } from '@/lib/enums';
import { ROUTES, LIMITS } from '@/lib/constants';

interface SkillFormData {
  name: string;
  category: number;
  proficiencyLevel: number;
  isPrimary: boolean;
  displayOrder: number;
}

const initialFormData: SkillFormData = {
  name: '',
  category: -1,
  proficiencyLevel: 1,
  isPrimary: false,
  displayOrder: 0,
};

export default function SkillsPage() {
  const { data: skillsData, isLoading, isError, refetch } = useSkills();
  const { data: categoriesData } = useSkillCategories();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const reorderSkills = useReorderSkills();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [formData, setFormData] = useState<SkillFormData>(initialFormData);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    label: string;
  }>({ open: false, id: '', label: '' });
  const [charCount, setCharCount] = useState(0);

  const skills = skillsData?.data || [];
  const categories = categoriesData?.data || [];

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingSkill(null);
    setCharCount(0);
  };

  const handleOpenAdd = () => {
    const maxOrder = skills.length > 0 ? Math.max(...skills.map((s) => s.displayOrder)) : 0;
    setFormData({ ...initialFormData, displayOrder: maxOrder + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: (typeof skills)[0]) => {
    const categoryIndex = categories.findIndex((c) => c.displayName === skill.category);
    setFormData({
      name: skill.name,
      category: categoryIndex >= 0 ? categories[categoryIndex].value : -1,
      proficiencyLevel: skill.proficiencyScore === 100 ? 3 : skill.proficiencyScore === 75 ? 2 : skill.proficiencyScore === 50 ? 1 : 0,
      isPrimary: skill.isPrimary,
      displayOrder: skill.displayOrder,
    });
    setEditingSkill(skill.id);
    setCharCount(skill.name.length);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.category === -1) return;

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      proficiencyLevel: formData.proficiencyLevel,
      isPrimary: formData.isPrimary,
      displayOrder: formData.displayOrder,
    };

    try {
      if (editingSkill) {
        await updateSkill.mutateAsync({ id: editingSkill, data: payload });
      } else {
        await createSkill.mutateAsync(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      // Erro já tratado no hook
    }
  };

  const handleDelete = () => {
    deleteSkill.mutate(deleteDialog.id);
    setDeleteDialog({ open: false, id: '', label: '' });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSkills = [...skills];
    [newSkills[index - 1], newSkills[index]] = [newSkills[index], newSkills[index - 1]];
    const reorderData = {
      skills: newSkills.map((s, i) => ({ id: s.id, displayOrder: i })),
    };
    reorderSkills.mutate(reorderData);
  };

  const handleMoveDown = (index: number) => {
    if (index === skills.length - 1) return;
    const newSkills = [...skills];
    [newSkills[index], newSkills[index + 1]] = [newSkills[index + 1], newSkills[index]];
    const reorderData = {
      skills: newSkills.map((s, i) => ({ id: s.id, displayOrder: i })),
    };
    reorderSkills.mutate(reorderData);
  };

  if (isLoading) {
    return <LoadingState message="Carregando habilidades..." size="lg" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar habilidades"
        message="Não foi possível carregar a lista de habilidades."
        onRetry={() => refetch()}
      />
    );
  }

  const isSaving = createSkill.isPending || updateSkill.isPending;

  return (
    <div className="flex flex-col gap-lg">
      <PageHeader
        title="Habilidades"
        description={`Gerencie suas competências técnicas e comportamentais. (${skills.length}/${LIMITS.SKILLS_MAX})`}
      >
        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Adicionar Habilidade
        </button>
      </PageHeader>

      {/* Lista de Habilidades */}
      {skills.length > 0 ? (
        <div className="flex flex-col gap-md">
          {skills.map((skill, index) => {
            const categoryInfo = categories.find((c) => c.displayName === skill.category);
            const profLevel = ProficiencyLevel[skill.proficiencyScore === 100 ? 3 : skill.proficiencyScore === 75 ? 2 : skill.proficiencyScore === 50 ? 1 : 0];

            return (
              <div
                key={skill.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex items-center gap-md shadow-level-1 hover:border-primary/30 transition-all group"
              >
                {/* Drag Handle / Order */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-outline hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <GripVertical className="h-5 w-5 text-outline-variant cursor-grab" />
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === skills.length - 1}
                    className="text-outline hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Skill Icon */}
                <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-2xl shrink-0">
                  {categoryInfo?.icon || '📦'}
                </div>

                {/* Skill Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-sm">
                    <h4 className="font-display text-label-md font-semibold text-on-surface">
                      {skill.name}
                    </h4>
                    {skill.isPrimary && (
                      <Star className="h-4 w-4 text-primary fill-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-sm mt-1">
                    <span className="text-[12px] text-secondary font-sans">
                      {skill.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span className={`text-[12px] font-medium font-sans ${
                      skill.proficiencyScore >= 75
                        ? 'text-emerald-600'
                        : skill.proficiencyScore >= 50
                          ? 'text-amber-600'
                          : 'text-secondary'
                    }`}>
                      {profLevel?.label || skill.proficiencyLevel}
                    </span>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="mt-2 w-full max-w-[200px] h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        skill.proficiencyScore >= 75
                          ? 'bg-emerald-500'
                          : skill.proficiencyScore >= 50
                            ? 'bg-amber-500'
                            : 'bg-primary'
                      }`}
                      style={{ width: `${skill.proficiencyScore}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-sm opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteDialog({
                        open: true,
                        id: skill.id,
                        label: skill.name,
                      })
                    }
                    className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-container transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="Nenhuma habilidade cadastrada"
          description="Adicione suas competências técnicas e comportamentais para enriquecer seu perfil."
          actionLabel="Adicionar Habilidade"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal de Adicionar/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface w-full max-w-xl rounded-xl border border-outline-variant shadow-level-2 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <header className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                  <Bolt className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-headline-sm text-on-surface">
                    {editingSkill ? 'Editar Habilidade' : 'Adicionar Habilidade'}
                  </h2>
                  <p className="font-sans text-body-sm text-on-surface-variant">
                    Configure os detalhes da sua competência profissional
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-xs rounded-full hover:bg-surface-variant/20 text-on-surface-variant transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Modal Content */}
            <form
              onSubmit={handleSubmit}
              className="p-lg overflow-y-auto custom-scrollbar space-y-lg"
            >
              {/* Nome da Habilidade */}
              <div className="space-y-base">
                <label
                  htmlFor="skillName"
                  className="block font-display text-label-md text-on-surface-variant"
                >
                  Nome da Habilidade
                </label>
                <div className="relative">
                  <input
                    id="skillName"
                    type="text"
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setCharCount(e.target.value.length);
                    }}
                    placeholder="Ex: React.js, Gestão de Projetos, Figma..."
                    className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline font-sans"
                  />
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-display text-label-sm ${
                    charCount >= 90 ? 'text-error' : 'text-outline'
                  }`}>
                    {charCount}/100
                  </div>
                </div>
              </div>

              {/* Grid: Categoria + Ordem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {/* Categoria */}
                <div className="space-y-base">
                  <label
                    htmlFor="skillCategory"
                    className="block font-display text-label-md text-on-surface-variant"
                  >
                    Categoria
                  </label>
                  <select
                    id="skillCategory"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: Number(e.target.value) })
                    }
                    className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-sans"
                  >
                    <option value={-1} disabled>
                      Selecione uma categoria
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordem de Exibição */}
                <div className="space-y-base">
                  <label
                    htmlFor="displayOrder"
                    className="block font-display text-label-md text-on-surface-variant"
                  >
                    Ordem de Exibição
                  </label>
                  <div className="flex items-center gap-xs">
                    <input
                      id="displayOrder"
                      type="number"
                      min={0}
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayOrder: Number(e.target.value),
                        })
                      }
                      className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                    <div className="flex flex-col gap-0">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            displayOrder: formData.displayOrder + 1,
                          })
                        }
                        className="p-0 text-outline hover:text-primary transition-colors"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            displayOrder: Math.max(0, formData.displayOrder - 1),
                          })
                        }
                        className="p-0 text-outline hover:text-primary transition-colors"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nível de Proficiência */}
              <div className="space-y-md p-md bg-surface-container-low rounded-xl border border-outline-variant/50">
                <div className="flex justify-between items-end">
                  <label className="font-display text-label-md text-on-surface-variant">
                    Nível de Proficiência
                  </label>
                  <span className="text-primary font-display text-label-sm uppercase tracking-wider">
                    {ProficiencyLevel[formData.proficiencyLevel]?.label || 'Intermediário'}
                  </span>
                </div>

                {/* Barra de Progresso */}
                <div className="h-3 w-full bg-outline-variant/30 rounded-full overflow-hidden flex gap-1 px-1 py-[2px]">
                  {[0, 1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-full flex-1 rounded-full transition-all duration-400 ${
                        level <= formData.proficiencyLevel
                          ? 'bg-primary'
                          : 'bg-outline-variant/40'
                      }`}
                    />
                  ))}
                </div>

                {/* Radio Selector */}
                <div className="grid grid-cols-4 gap-xs">
                  {([0, 1, 2, 3] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, proficiencyLevel: level })
                      }
                      className="flex flex-col items-center gap-xs group"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          formData.proficiencyLevel === level
                            ? 'border-primary'
                            : 'border-outline-variant group-hover:border-primary'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-primary transition-transform ${
                            formData.proficiencyLevel === level
                              ? 'scale-100'
                              : 'scale-0'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-display text-label-sm transition-colors ${
                          formData.proficiencyLevel === level
                            ? 'text-primary font-bold'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {level + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Marcar como Principal */}
              <div
                className="bg-surface-container-highest/30 p-md rounded-xl border border-outline-variant/30 flex items-center justify-between cursor-pointer hover:bg-surface-container-high/50 transition-all"
                onClick={() =>
                  setFormData({ ...formData, isPrimary: !formData.isPrimary })
                }
              >
                <div className="flex items-center gap-md">
                  <div className="p-xs bg-white rounded-lg border border-outline-variant shadow-level-1 text-primary">
                    <Star className="h-5 w-5 fill-primary" />
                  </div>
                  <div>
                    <p className="font-display text-label-md text-on-surface">
                      Marcar como Principal
                    </p>
                    <p className="text-[12px] text-on-surface-variant font-sans">
                      Destaque esta habilidade no topo do seu perfil
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPrimary}
                    onChange={(e) =>
                      setFormData({ ...formData, isPrimary: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </form>

            {/* Modal Footer */}
            <footer className="px-lg py-md border-t border-outline-variant bg-surface-container-lowest flex items-center justify-end gap-md">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-xl py-sm rounded-lg border border-outline-variant text-secondary font-display text-label-md hover:bg-surface-container-low transition-colors active:opacity-80"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving || !formData.name.trim() || formData.category === -1}
                className="px-xl py-sm rounded-lg bg-primary text-on-primary font-display text-label-md shadow-sm hover:shadow-md transition-all active:opacity-80 flex items-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingSkill ? 'Atualizar Habilidade' : 'Salvar Habilidade'}
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