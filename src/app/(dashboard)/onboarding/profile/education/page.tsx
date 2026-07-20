'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  GraduationCap,
  Calendar,
  Clock,
  Save,
  Loader2,
  X,
  AlignLeft,
  Star,
  FileText,
} from 'lucide-react';
import {
  useEducation,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatDate } from '@/lib/formatters';
import { EducationLevel, EducationStatus } from '@/lib/enums';
import { ROUTES, LIMITS } from '@/lib/constants';

interface EducationFormData {
  institution: string;
  course: string;
  educationLevel: number;
  status: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  grade: string;
  thesisTitle: string;
}

const initialFormData: EducationFormData = {
  institution: '',
  course: '',
  educationLevel: -1,
  status: 1, // Completed
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  grade: '',
  thesisTitle: '',
};

export default function EducationPage() {
  const { data: educationData, isLoading, isError, refetch } = useEducation();
  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EducationFormData>(initialFormData);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    label: string;
  }>({ open: false, id: '', label: '' });

  const educations = educationData?.data || [];

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: (typeof educations)[0]) => {
    const levelIndex = Object.values(EducationLevel).indexOf(edu.educationLevel);
    const statusIndex = Object.values(EducationStatus).indexOf(edu.status);
    setFormData({
      institution: edu.institution,
      course: edu.course,
      educationLevel: levelIndex >= 0 ? levelIndex : -1,
      status: statusIndex >= 0 ? statusIndex : 1,
      startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
      endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
      isCurrent: edu.isCurrent,
      description: edu.description || '',
      grade: edu.grade || '',
      thesisTitle: edu.thesisTitle || '',
    });
    setEditingId(edu.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution.trim() || !formData.course.trim() || formData.educationLevel === -1 || !formData.startDate) return;

    const payload = {
      institution: formData.institution.trim(),
      course: formData.course.trim(),
      educationLevel: formData.educationLevel,
      status: formData.status,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.isCurrent ? null : formData.endDate ? new Date(formData.endDate).toISOString() : null,
      description: formData.description.trim() || undefined,
      grade: formData.grade.trim() || undefined,
      thesisTitle: formData.thesisTitle.trim() || undefined,
    };

    try {
      if (editingId) {
        await updateEducation.mutateAsync({ id: editingId, data: payload });
      } else {
        await createEducation.mutateAsync(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      // Erro já tratado no hook
    }
  };

  const handleDelete = () => {
    deleteEducation.mutate(deleteDialog.id);
    setDeleteDialog({ open: false, id: '', label: '' });
  };

  if (isLoading) {
    return <LoadingState message="Carregando formação..." size="lg" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar formações"
        message="Não foi possível carregar a lista de formações."
        onRetry={() => refetch()}
      />
    );
  }

  const isSaving = createEducation.isPending || updateEducation.isPending;

  return (
    <div className="flex flex-col gap-lg">
      <PageHeader
        title="Formação Acadêmica"
        description={`Gerencie seu histórico educacional. (${educations.length}/${LIMITS.EDUCATION_MAX})`}
      >
        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Adicionar Formação
        </button>
      </PageHeader>

      {/* Lista de Formações */}
      {educations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1 hover:border-primary/30 transition-all group flex gap-lg"
            >
              {/* Ícone */}
              <div className="h-12 w-12 shrink-0 bg-primary-container/10 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <h4 className="font-display text-label-md font-bold text-on-surface">
                      {edu.course}
                    </h4>
                    <p className="font-sans text-body-sm text-primary font-medium">
                      {edu.institution}
                    </p>
                    <div className="flex items-center gap-sm mt-1 flex-wrap">
                      <span className="text-[12px] text-secondary font-sans">
                        {EducationLevel[edu.educationLevel as unknown as number] || edu.educationLevel}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span className={`text-[12px] font-medium font-sans ${
                        edu.status === 'Concluído' ? 'text-emerald-600' : edu.status === 'Em Andamento' ? 'text-amber-600' : 'text-secondary'
                      }`}>
                        {EducationStatus[edu.status as unknown as number] || edu.status}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span className="text-[12px] text-secondary flex items-center gap-1 font-sans">
                        <Clock className="h-3 w-3" />
                        {formatDate(edu.startDate, 'yyyy')} —{' '}
                        {edu.isCurrent ? 'Presente' : formatDate(edu.endDate, 'yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-sm opacity-0 group-hover:opacity-100 transition-all shrink-0">
                    <button
                      onClick={() => handleOpenEdit(edu)}
                      className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          id: edu.id,
                          label: `${edu.course} - ${edu.institution}`,
                        })
                      }
                      className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-container transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="mt-3 space-y-1">
                  {edu.grade && (
                    <p className="text-[12px] text-secondary font-sans flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Nota: {edu.grade}
                    </p>
                  )}
                  {edu.thesisTitle && (
                    <p className="text-[12px] text-secondary font-sans flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Tese: {edu.thesisTitle}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-[12px] text-on-surface-variant font-sans mt-2 line-clamp-2">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="Nenhuma formação cadastrada"
          description="Adicione seu histórico acadêmico para enriquecer seu perfil."
          actionLabel="Adicionar Formação"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal de Adicionar/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col border border-outline-variant overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <header className="px-xl py-lg flex justify-between items-start border-b border-outline-variant">
              <div>
                <h2 className="font-display text-headline-sm text-on-surface">
                  {editingId ? 'Editar Formação' : 'Adicionar Formação'}
                </h2>
                <p className="font-sans text-body-sm text-on-surface-variant mt-1">
                  Adicione detalhes da sua trajetória acadêmica.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Modal Body */}
            <div className="px-xl py-lg overflow-y-auto custom-scrollbar flex-1">
              <form id="educationForm" onSubmit={handleSubmit} className="space-y-lg">
                {/* Instituição & Curso */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-2">
                    <label
                      htmlFor="institution"
                      className="font-display text-label-md text-on-surface-variant block"
                    >
                      Instituição
                    </label>
                    <input
                      id="institution"
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="Ex: Universidade de São Paulo (USP)"
                      className="w-full h-12 px-md bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="course"
                      className="font-display text-label-md text-on-surface-variant block"
                    >
                      Curso
                    </label>
                    <input
                      id="course"
                      type="text"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      placeholder="Ex: Ciência da Computação"
                      className="w-full h-12 px-md bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Nível de Ensino & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-2">
                    <label
                      htmlFor="educationLevel"
                      className="font-display text-label-md text-on-surface-variant block"
                    >
                      Nível de Ensino
                    </label>
                    <div className="relative">
                      <select
                        id="educationLevel"
                        value={formData.educationLevel}
                        onChange={(e) =>
                          setFormData({ ...formData, educationLevel: Number(e.target.value) })
                        }
                        className="w-full h-12 pl-md pr-10 bg-white border border-outline-variant rounded-lg font-sans text-body-md appearance-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value={-1} disabled>
                          Selecione o nível
                        </option>
                        {Object.entries(EducationLevel).map(([key, label]) => (
                          <option key={key} value={Number(key)}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <GraduationCap className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline pointer-events-none" />
                    </div>
                  </div>

                  {/* Status Radio Buttons */}
                  <div className="space-y-2">
                    <label className="font-display text-label-md text-on-surface-variant block">
                      Status
                    </label>
                    <div className="flex p-1 bg-surface-container-low rounded-lg h-12">
                      {([1, 0, 2] as const).map((statusValue) => (
                        <label
                          key={statusValue}
                          className="flex-1 flex items-center justify-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="status"
                            value={statusValue}
                            checked={formData.status === statusValue}
                            onChange={() =>
                              setFormData({ ...formData, status: statusValue })
                            }
                            className="hidden peer"
                          />
                          <span className="w-full h-full flex items-center justify-center rounded-md font-display text-label-sm text-on-secondary-fixed-variant peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-level-1 transition-all">
                            {EducationStatus[statusValue]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Período */}
                <div className="space-y-md p-md bg-surface-container-low rounded-lg border border-outline-variant/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-display text-label-md text-on-surface font-semibold">
                      Período
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="space-y-2">
                      <label
                        htmlFor="startDate"
                        className="font-display text-label-sm text-on-surface-variant block"
                      >
                        Data de Início
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        className="w-full h-10 px-md bg-white border border-outline-variant rounded-lg font-sans text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div
                      className="space-y-2"
                      style={{ opacity: formData.isCurrent ? 0.4 : 1 }}
                    >
                      <label
                        htmlFor="endDate"
                        className="font-display text-label-sm text-on-surface-variant block"
                      >
                        Data de Término
                      </label>
                      <input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        disabled={formData.isCurrent}
                        className="w-full h-10 px-md bg-white border border-outline-variant rounded-lg font-sans text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      id="isCurrent"
                      type="checkbox"
                      checked={formData.isCurrent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isCurrent: e.target.checked,
                          endDate: e.target.checked ? '' : formData.endDate,
                        })
                      }
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <label
                      htmlFor="isCurrent"
                      className="font-sans text-body-sm text-on-surface select-none cursor-pointer"
                    >
                      Atualmente estudando aqui
                    </label>
                  </div>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="font-display text-label-md text-on-surface-variant block"
                  >
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descreva suas principais atividades, projetos relevantes ou honrarias acadêmicas..."
                    rows={4}
                    className="w-full p-md bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                {/* Campos Opcionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg border-t border-outline-variant/30 pt-lg">
                  <div className="space-y-2">
                    <label
                      htmlFor="grade"
                      className="font-display text-label-md text-on-surface-variant block"
                    >
                      Nota/GPA (Opcional)
                    </label>
                    <input
                      id="grade"
                      type="text"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="Ex: 9.5 ou 3.8/4.0"
                      maxLength={20}
                      className="w-full h-12 px-md bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="thesisTitle"
                      className="font-display text-label-md text-on-surface-variant block"
                    >
                      Título da Tese/Projeto (Opcional)
                    </label>
                    <input
                      id="thesisTitle"
                      type="text"
                      value={formData.thesisTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, thesisTitle: e.target.value })
                      }
                      placeholder="Título do trabalho de conclusão"
                      maxLength={300}
                      className="w-full h-12 px-md bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <footer className="px-xl py-lg border-t border-outline-variant flex items-center justify-end gap-md bg-surface-container-lowest">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-lg h-12 border border-outline-variant rounded-lg text-secondary font-display text-label-md hover:bg-surface-container-low transition-all active:scale-[0.98]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="educationForm"
                disabled={
                  isSaving ||
                  !formData.institution.trim() ||
                  !formData.course.trim() ||
                  formData.educationLevel === -1 ||
                  !formData.startDate
                }
                className="px-lg h-12 bg-primary text-on-primary rounded-lg font-display text-label-md hover:opacity-90 shadow-md transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingId ? 'Atualizar Formação' : 'Salvar Formação'}
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