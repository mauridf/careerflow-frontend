'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Briefcase,
  Calendar,
  AlignLeft,
  Plus,
  X,
  Search,
  Info,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { experienceSchema, type ExperienceFormData } from '@/lib/validators';
import { useCreateExperience } from '@/hooks';
import { useSkills, useCreateSkill, useSkillCategories } from '@/hooks';
import { ROUTES, LIMITS } from '@/lib/constants';
import { SkillCategory, ProficiencyLevel } from '@/lib/enums';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function OnboardingStep3Page() {
  const router = useRouter();
  const createExperience = useCreateExperience();
  const { data: skillsData } = useSkills();
  const { data: categoriesData } = useSkillCategories();
  const createSkill = useCreateSkill();

  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const existingSkills = skillsData?.data || [];
  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      skillsUsed: [],
      employmentType: 0,
    },
  });

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      const payload = {
        ...data,
        startDate: `${data.startDate}-01`,
        endDate: isCurrentJob ? null : data.endDate ? `${data.endDate}-01` : null,
        skillsUsed: selectedSkills,
      };
      await createExperience.mutateAsync(payload);
      router.push(ROUTES.PROFILE);
    } catch {
      // Erro já tratado no hook
    }
  };

  const handleAddSkill = useCallback(async () => {
    if (!newSkillName.trim()) return;
    try {
      const result = await createSkill.mutateAsync({
        name: newSkillName.trim(),
        category: 7, // Other
        proficiencyLevel: 1, // Intermediate
      });
      setSelectedSkills((prev) => [...prev, result.data.id]);
      setNewSkillName('');
    } catch {
      // Erro já tratado no hook
    }
  }, [newSkillName, createSkill]);

  const toggleSkill = useCallback((skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  }, []);

  const removeSkill = useCallback((skillId: string) => {
    setSelectedSkills((prev) => prev.filter((id) => id !== skillId));
  }, []);

  const isLoading = createExperience.isPending;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-margin-mobile">
      <main className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-headline-md font-bold text-primary tracking-tight">
            CareerFlow
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          {/* Main Card - Left Column */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-1 p-lg md:p-xl">
              {/* Progress Indicator */}
              <div className="flex flex-col items-center mb-xl">
                <span className="font-display text-label-md text-secondary mb-base">
                  Passo 3 de 3
                </span>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary progress-step-active shadow-[0_0_12px_rgba(79,70,229,0.3)]" />
                </div>
              </div>

              <div className="mb-lg">
                <h2 className="font-display text-headline-sm text-on-surface mb-xs">
                  Experiência Recente
                </h2>
                <p className="font-sans text-body-md text-on-surface-variant">
                  Destaque suas conquistas e habilidades mais recentes.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
                {/* Company & Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label
                      htmlFor="companyName"
                      className="font-display text-label-md text-on-surface"
                    >
                      Empresa
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                      <input
                        id="companyName"
                        type="text"
                        placeholder="Ex: Google, Nubank..."
                        {...register('companyName')}
                        className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.companyName ? 'border-error' : 'border-outline-variant'
                        }`}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-body-sm text-error">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label
                      htmlFor="position"
                      className="font-display text-label-md text-on-surface"
                    >
                      Cargo
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                      <input
                        id="position"
                        type="text"
                        placeholder="Ex: Desenvolvedor Sênior"
                        {...register('position')}
                        className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.position ? 'border-error' : 'border-outline-variant'
                        }`}
                      />
                    </div>
                    {errors.position && (
                      <p className="text-body-sm text-error">
                        {errors.position.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="font-display text-label-md text-on-surface">
                      Data de Início
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                      <input
                        type="month"
                        {...register('startDate')}
                        className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.startDate ? 'border-error' : 'border-outline-variant'
                        }`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="text-body-sm text-error">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="font-display text-label-md text-on-surface">
                      Data de Fim
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                      <input
                        type="month"
                        {...register('endDate')}
                        disabled={isCurrentJob}
                        className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                          errors.endDate ? 'border-error' : 'border-outline-variant'
                        }`}
                      />
                    </div>
                    <label className="mt-xs flex items-center gap-xs cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isCurrentJob}
                        onChange={(e) => setIsCurrentJob(e.target.checked)}
                        className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"
                      />
                      <span className="font-sans text-body-sm text-on-surface-variant">
                        Trabalho atualmente aqui
                      </span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-xs">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="description"
                      className="font-display text-label-md text-on-surface"
                    >
                      Descrição das Atividades
                    </label>
                    <span className="font-display text-label-sm text-outline">
                      Opcional
                    </span>
                  </div>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-outline" />
                    <textarea
                      id="description"
                      rows={4}
                      placeholder="Descreva suas principais responsabilidades e conquistas impactantes..."
                      {...register('description')}
                      className="w-full pl-10 pr-4 py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-md resize-none transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-lg flex flex-col gap-sm">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-display text-label-md py-md rounded-lg hover:bg-surface-tint active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        SALVANDO...
                      </>
                    ) : (
                      <>
                        FINALIZAR 🎉
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <Link
                    href={ROUTES.PROFILE}
                    className="w-full bg-transparent text-secondary font-display text-label-md py-md rounded-lg hover:bg-surface-container-low transition-colors text-center"
                  >
                    Pular
                  </Link>
                </div>
              </form>
            </div>

            {/* Footer Navigation */}
            <div className="mt-lg flex justify-between items-center">
              <Link
                href={ROUTES.ONBOARDING_STEP2}
                className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-all font-display font-semibold group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar
              </Link>
            </div>
          </div>

          {/* Right Column - Skills Panel */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-lowest border border-l-4 border-l-primary border-outline-variant rounded-xl shadow-level-1 p-lg">
              <div className="flex items-center gap-sm mb-lg">
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                  <Plus className="h-5 w-5 text-on-primary-container" />
                </div>
                <h2 className="font-display text-headline-sm text-on-surface">
                  Habilidades
                </h2>
              </div>

              {/* Search/Add Skill */}
              <div className="relative mb-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Adicionar skill..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-sans"
                />
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-xs mb-lg">
                {selectedSkills.map((skillId) => {
                  const skill = existingSkills.find((s) => s.id === skillId);
                  return (
                    <div
                      key={skillId}
                      className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-label-md font-medium border border-transparent hover:border-primary transition-colors"
                    >
                      {skill?.name || skillId}
                      <button
                        type="button"
                        onClick={() => removeSkill(skillId)}
                        className="hover:text-error transition-colors flex items-center"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
                {existingSkills
                  .filter((s) => !selectedSkills.includes(s.id))
                  .slice(0, 5)
                  .map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className="flex items-center gap-1 bg-surface-container-low text-on-surface-variant px-3 py-1.5 rounded-full text-label-md font-medium border border-outline-variant hover:border-primary hover:text-primary transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      {skill.name}
                    </button>
                  ))}
              </div>

              {/* Info */}
              <div className="p-md bg-surface-container rounded-lg">
                <p className="font-sans text-body-sm text-on-surface-variant flex items-start gap-sm">
                  <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Habilidades aumentam sua visibilidade em 40% perante recrutadores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}