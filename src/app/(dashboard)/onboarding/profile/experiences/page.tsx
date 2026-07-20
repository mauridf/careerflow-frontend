'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  Search,
  X,
  Save,
  Loader2,
  Shield,
  AlignLeft,
  Info,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  useExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
  useSkills,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatDate, formatCityState } from '@/lib/formatters';
import { EmploymentType } from '@/lib/enums';
import { ROUTES, LIMITS } from '@/lib/constants';

interface ExperienceFormData {
  companyName: string;
  position: string;
  employmentType: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  country: string;
  city: string;
  state: string;
  description: string;
  skillsUsed: string[];
}

const initialFormData: ExperienceFormData = {
  companyName: '',
  position: '',
  employmentType: 0,
  startDate: '',
  endDate: '',
  isCurrent: false,
  country: 'Brasil',
  city: '',
  state: '',
  description: '',
  skillsUsed: [],
};

export default function ExperiencesPage() {
  const { data: experiencesData, isLoading, isError, refetch } = useExperiences();
  const { data: skillsData } = useSkills();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>(initialFormData);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    label: string;
  }>({ open: false, id: '', label: '' });
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [descCharCount, setDescCharCount] = useState(0);

  const experiences = experiencesData?.data || [];
  const allSkills = skillsData?.data || [];

  const filteredSkills = allSkills.filter(
    (s) =>
      (!skillSearch || s.name.toLowerCase().includes(skillSearch.toLowerCase())) &&
      !formData.skillsUsed.includes(s.id)
  );

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setSkillSearch('');
    setShowSkillDropdown(false);
    setDescCharCount(0);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: (typeof experiences)[0]) => {
    setFormData({
      companyName: exp.companyName,
      position: exp.position,
      employmentType: ['Tempo Integral', 'Meio Período', 'Contrato', 'Estágio', 'Freelance', 'Remoto', 'Voluntário'].indexOf(exp.employmentType || ''),
      startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      isCurrent: exp.isCurrent,
      country: exp.country || 'Brasil',
      city: exp.city || '',
      state: exp.state || '',
      description: exp.description || '',
      skillsUsed: exp.skillsUsed || [],
    });
    setEditingId(exp.id);
    setDescCharCount(exp.description?.length || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.position.trim() || !formData.startDate) return;

    const payload = {
      companyName: formData.companyName.trim(),
      position: formData.position.trim(),
      employmentType: formData.employmentType,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.isCurrent ? null : formData.endDate ? new Date(formData.endDate).toISOString() : null,
      country: formData.country.trim(),
      city: formData.city.trim() || undefined,
      state: formData.state.trim() || undefined,
      description: formData.description.trim() || undefined,
      skillsUsed: formData.skillsUsed,
    };

    try {
      if (editingId) {
        await updateExperience.mutateAsync({ id: editingId, data: payload });
      } else {
        await createExperience.mutateAsync(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      // Erro já tratado no hook
    }
  };

  const handleDelete = () => {
    deleteExperience.mutate(deleteDialog.id);
    setDeleteDialog({ open: false, id: '', label: '' });
  };

  const addSkill = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsUsed: [...prev.skillsUsed, skillId],
    }));
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsUsed: prev.skillsUsed.filter((id) => id !== skillId),
    }));
  };

  if (isLoading) {
    return <LoadingState message="Carregando experiências..." size="lg" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar experiências"
        message="Não foi possível carregar a lista de experiências."
        onRetry={() => refetch()}
      />
    );
  }

  const isSaving = createExperience.isPending || updateExperience.isPending;

  return (
    <div className="flex flex-col gap-lg">
      <PageHeader
        title="Experiências Profissionais"
        description={`Gerencie sua trajetória profissional. (${experiences.length}/${LIMITS.EXPERIENCES_MAX})`}
      >
        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Adicionar Experiência
        </button>
      </PageHeader>

      {/* Lista de Experiências */}
      {experiences.length > 0 ? (
        <div className="flex flex-col gap-md">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex items-start gap-lg shadow-level-1 hover:border-primary/30 transition-all group"
            >
              {/* Ícone */}
              <div className="h-12 w-12 shrink-0 bg-primary-container rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-on-primary-container" />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <h4 className="font-display text-label-md font-bold text-on-surface">
                      {exp.position}
                    </h4>
                    <p className="font-sans text-body-sm text-primary font-medium">
                      {exp.companyName}
                    </p>
                    <div className="flex items-center gap-sm mt-1 flex-wrap">
                      <span className="text-[12px] text-secondary flex items-center gap-1 font-sans">
                        <Clock className="h-3 w-3" />
                        {formatDate(exp.startDate, 'MM/yyyy')} —{' '}
                        {exp.isCurrent ? 'Presente' : formatDate(exp.endDate, 'MM/yyyy')}
                        {exp.durationFormatted && ` • ${exp.durationFormatted}`}
                      </span>
                      {exp.employmentType && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-outline-variant" />
                          <span className="text-[12px] text-secondary font-sans">
                            {exp.employmentType}
                          </span>
                        </>
                      )}
                      {(exp.city || exp.state) && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-outline-variant" />
                          <span className="text-[12px] text-secondary flex items-center gap-1 font-sans">
                            <MapPin className="h-3 w-3" />
                            {formatCityState(exp.city, exp.state)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-sm opacity-0 group-hover:opacity-100 transition-all shrink-0">
                    <button
                      onClick={() => handleOpenEdit(exp)}
                      className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          id: exp.id,
                          label: `${exp.position} - ${exp.companyName}`,
                        })
                      }
                      className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-container transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Descrição truncada */}
                {exp.description && (
                  <p className="font-sans text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                    {exp.description}
                  </p>
                )}

                {/* Skills tags */}
                {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-xs mt-3">
                    {exp.skillsUsed.slice(0, 5).map((skillId) => {
                      const skill = allSkills.find((s) => s.id === skillId);
                      return skill ? (
                        <span
                          key={skillId}
                          className="inline-flex items-center px-2 py-0.5 bg-secondary-container/50 text-on-secondary-container rounded-full text-[12px] font-medium font-sans"
                        >
                          {skill.name}
                        </span>
                      ) : null;
                    })}
                    {exp.skillsUsed.length > 5 && (
                      <span className="text-[12px] text-secondary font-sans">
                        +{exp.skillsUsed.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="Nenhuma experiência cadastrada"
          description="Adicione suas experiências profissionais para enriquecer seu currículo."
          actionLabel="Adicionar Experiência"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal de Adicionar/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface w-full max-w-4xl max-h-[90vh] flex flex-col glass-card rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <header className="flex items-center justify-between px-lg py-md border-b border-outline-variant bg-surface-container-lowest">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-headline-sm text-on-surface">
                    Experiência Profissional
                  </h2>
                  <p className="font-display text-label-md text-on-surface-variant">
                    {editingId ? 'Edite os detalhes' : 'Adicione ou edite detalhes'} da sua trajetória.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-xs hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-on-surface-variant" />
              </button>
            </header>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-lg custom-scrollbar space-y-xl">
              {/* Informações Básicas */}
              <section className="space-y-lg">
                <div className="flex items-center gap-xs border-b border-outline-variant pb-xs">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-label-md text-primary uppercase tracking-wider">
                    Informações Básicas
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-xs">
                    <label className="font-display text-label-md text-on-surface">Empresa</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Ex: Google, Nubank..."
                      className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-display text-label-md text-on-surface">Cargo</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Ex: Engenheiro de Software Sênior"
                      className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-display text-label-md text-on-surface">Tipo de Contrato</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) =>
                        setFormData({ ...formData, employmentType: Number(e.target.value) })
                      }
                      className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-sans"
                    >
                      <option value={-1}>Selecione o tipo</option>
                      {Object.entries(EmploymentType).map(([key, label]) => (
                        <option key={key} value={Number(key)}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end h-11">
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isCurrent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isCurrent: e.target.checked,
                            endDate: e.target.checked ? '' : formData.endDate,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      <span className="ms-3 font-display text-label-md text-on-surface">
                        Trabalho atualmente aqui
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Período e Localização */}
              <section className="space-y-lg">
                <div className="flex items-center gap-xs border-b border-outline-variant pb-xs">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-label-md text-primary uppercase tracking-wider">
                    Período e Localização
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                  <div className="space-y-xs">
                    <label className="font-display text-label-md text-on-surface">Data de Início</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-xs" style={{ opacity: formData.isCurrent ? 0.5 : 1 }}>
                    <label className="font-display text-label-md text-on-surface">Data de Término</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.isCurrent}
                      className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-display text-label-md text-on-surface">País</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Brasil"
                      className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div className="space-y-xs">
                      <label className="font-display text-label-md text-on-surface">Cidade</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="SP"
                        className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-xs">
                      <label className="font-display text-label-md text-on-surface">Estado</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="UF"
                        maxLength={2}
                        className="w-full h-11 px-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Descrição */}
              <section className="space-y-lg">
                <div className="flex items-center gap-xs border-b border-outline-variant pb-xs">
                  <AlignLeft className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-label-md text-primary uppercase tracking-wider">
                    Descrição das Atividades
                  </h3>
                </div>
                <div className="space-y-xs">
                  <div className="flex justify-between items-center">
                    <label className="font-display text-label-md text-on-surface">
                      Responsabilidades e Conquistas
                    </label>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-display text-label-sm transition-colors ${
                        descCharCount >= 50
                          ? 'text-on-primary bg-emerald-500'
                          : 'text-on-surface-variant bg-surface-container-high'
                      }`}
                    >
                      {descCharCount} / 50 min
                    </span>
                  </div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setDescCharCount(e.target.value.length);
                    }}
                    placeholder="Descreva suas principais responsabilidades, projetos e tecnologias utilizadas. Recomendamos pelo menos 50 caracteres para uma melhor análise de perfil."
                    rows={5}
                    className="w-full p-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-sans"
                  />
                </div>
              </section>

              {/* Habilidades */}
              <section className="space-y-lg">
                <div className="flex items-center gap-xs border-b border-outline-variant pb-xs">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-label-md text-primary uppercase tracking-wider">
                    Habilidades Utilizadas
                  </h3>
                </div>
                <div className="space-y-md">
                  <div className="relative">
                    <Search className="absolute left-md top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                    <input
                      type="text"
                      value={skillSearch}
                      onChange={(e) => {
                        setSkillSearch(e.target.value);
                        setShowSkillDropdown(true);
                      }}
                      onFocus={() => setShowSkillDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                      placeholder="Buscar habilidades (Ex: React, Gestão Ágil, SQL...)"
                      className="w-full h-11 pl-xl pr-md rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                    {/* Dropdown de sugestões */}
                    {showSkillDropdown && filteredSkills.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-outline-variant rounded-lg shadow-level-2 max-h-40 overflow-y-auto z-10">
                        {filteredSkills.slice(0, 8).map((skill) => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => addSkill(skill.id)}
                            className="w-full text-left px-md py-2 text-body-sm font-sans hover:bg-surface-container-low transition-colors"
                          >
                            {skill.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-sm">
                    {formData.skillsUsed.map((skillId) => {
                      const skill = allSkills.find((s) => s.id === skillId);
                      return (
                        <div
                          key={skillId}
                          className="flex items-center gap-xs px-sm py-1.5 bg-secondary-container text-on-secondary-container rounded-full font-display text-label-md border border-outline-variant/30"
                        >
                          {skill?.name || skillId}
                          <button
                            type="button"
                            onClick={() => removeSkill(skillId)}
                            className="hover:text-error transition-colors flex items-center"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setSkillSearch('');
                        setShowSkillDropdown(true);
                      }}
                      className="flex items-center gap-xs px-sm py-1.5 bg-white text-on-surface-variant hover:text-primary rounded-full font-display text-label-md border border-dashed border-outline-variant hover:border-primary transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Outra
                    </button>
                  </div>
                </div>
              </section>
            </form>

            {/* Footer */}
            <footer className="px-lg py-md border-t border-outline-variant bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-md">
              <div className="flex items-center gap-xs text-on-surface-variant">
                <Shield className="h-4 w-4" />
                <span className="text-[12px] font-sans text-body-sm italic">
                  Suas informações são tratadas de forma segura conforme nossa LGPD.
                </span>
              </div>
              <div className="flex items-center gap-md w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 md:flex-none px-lg h-11 rounded-lg border border-outline-variant text-on-secondary-fixed-variant font-display text-label-md hover:bg-surface-container-high transition-all active:opacity-80"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSaving || !formData.companyName.trim() || !formData.position.trim() || !formData.startDate}
                  className="flex-1 md:flex-none px-xl h-11 rounded-lg bg-primary text-white font-display text-label-md shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Experiência
                    </>
                  )}
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}