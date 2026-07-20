'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Edit3,
  Plus,
  Star,
  GraduationCap,
  Clock,
  ExternalLink,
  Award,
  Globe,
  FileText,
  Pencil,
  Trash2,
  User,
  Loader2,
  BadgeCheck,
} from 'lucide-react';
import {
  useProfile,
  useProfileCompletion,
  useSkills,
  useExperiences,
  useEducation,
  useCertificates,
  useLanguages,
  useDeleteSkill,
  useDeleteExperience,
  useDeleteEducation,
  useDeleteLanguage,
  useDeleteCertificate,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatDate, formatPhone, formatCityState, formatPercentage, truncateText } from '@/lib/formatters';
import { SkillCategory, ProficiencyLevel, EducationLevel, EducationStatus, LanguageLevel } from '@/lib/enums';
import { ROUTES } from '@/lib/constants';

export default function ProfilePage() {
  const router = useRouter();
  const { data: profileData, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfile();
  const { data: completionData } = useProfileCompletion();
  const { data: skillsData, isLoading: skillsLoading } = useSkills();
  const { data: experiencesData, isLoading: experiencesLoading } = useExperiences();
  const { data: educationData, isLoading: educationLoading } = useEducation();
  const { data: languagesData, isLoading: languagesLoading } = useLanguages();
  const { data: certificatesData, isLoading: certificatesLoading } = useCertificates();

  const deleteSkill = useDeleteSkill();
  const deleteExperience = useDeleteExperience();
  const deleteEducation = useDeleteEducation();
  const deleteLanguage = useDeleteLanguage();
  const deleteCertificate = useDeleteCertificate();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'skill' | 'experience' | 'education' | 'language' | 'certificate';
    id: string;
    label: string;
  }>({ open: false, type: 'skill', id: '', label: '' });

  const profile = profileData?.data;
  const completion = completionData?.data;
  const skills = skillsData?.data || [];
  const experiences = experiencesData?.data || [];
  const education = educationData?.data || [];
  const languages = languagesData?.data || [];
  const certificates = certificatesData?.data || [];

  if (profileLoading || skillsLoading || experiencesLoading || educationLoading || languagesLoading || certificatesLoading) {
    return <LoadingState message="Carregando perfil..." size="lg" />;
  }

  if (profileError) {
    return (
      <ErrorState
        title="Erro ao carregar perfil"
        message="Não foi possível carregar os dados do perfil."
        onRetry={() => refetchProfile()}
      />
    );
  }

  const handleDelete = () => {
    switch (deleteDialog.type) {
      case 'skill':
        deleteSkill.mutate(deleteDialog.id);
        break;
      case 'experience':
        deleteExperience.mutate(deleteDialog.id);
        break;
      case 'education':
        deleteEducation.mutate(deleteDialog.id);
        break;
      case 'language':
        deleteLanguage.mutate(deleteDialog.id);
        break;
      case 'certificate':
        deleteCertificate.mutate(deleteDialog.id);
        break;
    }
    setDeleteDialog({ open: false, type: 'skill', id: '', label: '' });
  };

  return (
    <div className="flex flex-col gap-lg">
      <PageHeader
        title="Perfil"
        description="Gerencie suas informações profissionais."
      >
        <Link href={ROUTES.ONBOARDING} className="btn-secondary">
          <Pencil className="h-4 w-4" />
          Editar Perfil
        </Link>
      </PageHeader>

      {/* Profile Header Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl flex flex-col md:flex-row items-center md:items-start gap-xl shadow-level-1">
        {/* Photo */}
        <div className="relative">
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-level-1 bg-surface-container flex items-center justify-center">
            {profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile?.currentPosition || 'Foto de perfil'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-16 w-16 text-primary/60" />
            )}
          </div>
          <Link
            href={ROUTES.ONBOARDING_STEP1}
            className="absolute bottom-0 right-0 bg-white border border-outline-variant p-2 rounded-full shadow-level-1 hover:bg-surface-container-low transition-colors"
          >
            <Edit3 className="h-4 w-4 text-secondary" />
          </Link>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-display-lg-mobile lg:text-display-lg text-on-surface">
                {profile?.currentPosition || 'Seu Nome'}
              </h1>
              <p className="text-secondary font-sans text-body-lg">
                {profile?.currentPosition && profile?.currentCompany
                  ? `${profile.currentPosition} • ${profile.currentCompany}`
                  : 'Complete seu perfil'}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <Link href={ROUTES.ONBOARDING} className="btn-primary">
                <Star className="h-4 w-4" />
                Completar Perfil
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          {completion && (
            <div className="mt-xl max-w-md mx-auto md:mx-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-display text-label-md text-on-surface">
                  Completude do Perfil
                </span>
                <span className="font-display text-label-md text-primary font-bold">
                  {formatPercentage(completion.percentage)}
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${Math.min(completion.percentage, 100)}%` }}
                />
              </div>
              {completion.missingFields.length > 0 && (
                <p className="text-[12px] text-secondary mt-2">
                  Campos pendentes: {completion.missingFields.join(', ')}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Informações Pessoais */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-display text-headline-sm text-on-surface">
              Informações Pessoais
            </h3>
            <Link
              href={ROUTES.ONBOARDING_STEP1}
              className="text-secondary hover:text-primary transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-secondary opacity-60" />
              <div>
                <p className="text-[12px] text-secondary">Telefone</p>
                <p className="text-on-surface font-medium font-sans text-body-sm">
                  {formatPhone(profile?.phone)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-secondary opacity-60" />
              <div>
                <p className="text-[12px] text-secondary">Localização</p>
                <p className="text-on-surface font-medium font-sans text-body-sm">
                  {formatCityState(profile?.city, profile?.state)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-secondary opacity-60" />
              <div>
                <p className="text-[12px] text-secondary">Data de Nascimento</p>
                <p className="text-on-surface font-medium font-sans text-body-sm">
                  {formatDate(profile?.birthDate)}
                </p>
              </div>
            </div>
            {profile?.currentCompany && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-secondary opacity-60" />
                <div>
                  <p className="text-[12px] text-secondary">Empresa Atual</p>
                  <p className="text-on-surface font-medium font-sans text-body-sm">
                    {profile.currentCompany}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumo Profissional */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-display text-headline-sm text-on-surface">
              Resumo Profissional
            </h3>
            <Link
              href={ROUTES.ONBOARDING_STEP2}
              className="text-secondary hover:text-primary transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </Link>
          </div>
          {profile?.professionalSummary ? (
            <p className="text-on-surface-variant leading-relaxed font-sans text-body-md">
              {profile.professionalSummary}
            </p>
          ) : (
            <EmptyState
              icon={FileText}
              title="Sem resumo profissional"
              description="Adicione um resumo para destacar sua trajetória."
              actionLabel="Adicionar Resumo"
              onAction={() => router.push(ROUTES.ONBOARDING_STEP2)}
            />
          )}
        </div>

        {/* Habilidades */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-display text-headline-sm text-on-surface">
              Habilidades
            </h3>
            <Link
              href={ROUTES.SKILLS}
              className="text-secondary hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Link>
          </div>
          {skills.length > 0 ? (
            <div className="space-y-3">
              {skills.slice(0, 5).map((skill) => (
                <div
                  key={skill.id}
                  className="p-3 bg-surface border border-outline-variant rounded-xl flex items-center justify-between group"
                >
                  <div>
                    <p className="font-medium font-sans text-label-md text-on-surface">
                      {skill.name}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                      {ProficiencyLevel[skill.proficiencyScore === 100 ? 3 : skill.proficiencyScore === 75 ? 2 : skill.proficiencyScore === 50 ? 1 : 0]?.label}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-primary">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (skill.proficiencyScore >= 75 ? 3 : skill.proficiencyScore >= 50 ? 2 : 1)
                              ? 'fill-primary text-primary'
                              : 'text-outline-variant'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          type: 'skill',
                          id: skill.id,
                          label: skill.name,
                        })
                      }
                      className="opacity-0 group-hover:opacity-100 text-secondary hover:text-error transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {skills.length > 5 && (
                <Link
                  href={ROUTES.SKILLS}
                  className="text-primary font-display text-label-sm hover:underline block text-center mt-2"
                >
                  Ver todas ({skills.length})
                </Link>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Award}
              title="Nenhuma habilidade"
              description="Adicione suas habilidades técnicas."
              actionLabel="Adicionar Habilidade"
              onAction={() => router.push(ROUTES.SKILLS)}
            />
          )}
        </div>

        {/* Experiências Recentes */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-display text-headline-sm text-on-surface">
              Experiências Recentes
            </h3>
            <Link
              href={ROUTES.EXPERIENCES}
              className="text-secondary hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Link>
          </div>
          {experiences.length > 0 ? (
            <div className="space-y-4 relative">
              {experiences.slice(0, 3).map((exp, index) => (
                <div key={exp.id} className="flex gap-4 group">
                  <div className="h-10 w-10 shrink-0 bg-primary-container rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-on-primary-container" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold font-sans text-on-surface text-body-sm">
                          {exp.position}
                        </h4>
                        <p className="text-primary text-sm font-medium">{exp.companyName}</p>
                        <p className="text-[12px] text-secondary flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(exp.startDate, 'MM/yyyy')} —{' '}
                          {exp.isCurrent ? 'Presente' : formatDate(exp.endDate, 'MM/yyyy')}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            type: 'experience',
                            id: exp.id,
                            label: `${exp.position} - ${exp.companyName}`,
                          })
                        }
                        className="opacity-0 group-hover:opacity-100 text-secondary hover:text-error transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {exp.description && (
                      <p className="text-on-surface-variant font-sans text-body-sm mt-1">
                        {truncateText(exp.description, 120)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {experiences.length > 3 && (
                <Link
                  href={ROUTES.EXPERIENCES}
                  className="text-primary font-display text-label-sm hover:underline block text-center mt-2"
                >
                  Ver todas ({experiences.length})
                </Link>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="Nenhuma experiência"
              description="Adicione suas experiências profissionais."
              actionLabel="Adicionar Experiência"
              onAction={() => router.push(ROUTES.EXPERIENCES)}
            />
          )}
        </div>

        {/* Idiomas */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-display text-headline-sm text-on-surface">
              Idiomas
            </h3>
            <Link
              href={ROUTES.LANGUAGES}
              className="text-secondary hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Link>
          </div>
          {languages.length > 0 ? (
            <div className="space-y-3">
              {languages.slice(0, 5).map((lang) => (
                <div
                  key={lang.id}
                  className="p-3 bg-surface border border-outline-variant rounded-xl flex items-center justify-between group"
                >
                  <div>
                    <p className="font-medium font-sans text-label-md text-on-surface">
                      {lang.languageName}
                    </p>
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                      {LanguageLevel[lang.proficiencyScore === 10 ? 0 : lang.proficiencyScore === 25 ? 1 : lang.proficiencyScore === 45 ? 2 : lang.proficiencyScore === 65 ? 3 : lang.proficiencyScore === 85 ? 4 : lang.proficiencyScore === 95 ? 5 : 6]?.label || lang.proficiencyLevel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {lang.isNative && (
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                        Nativo
                      </span>
                    )}
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          type: 'language',
                          id: lang.id,
                          label: lang.languageName,
                        })
                      }
                      className="opacity-0 group-hover:opacity-100 text-secondary hover:text-error transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {languages.length > 5 && (
                <Link
                  href={ROUTES.LANGUAGES}
                  className="text-primary font-display text-label-sm hover:underline block text-center mt-2"
                >
                  Ver todas ({languages.length})
                </Link>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Globe}
              title="Nenhum idioma"
              description="Adicione os idiomas que você fala."
              actionLabel="Adicionar Idioma"
              onAction={() => router.push(ROUTES.LANGUAGES)}
            />
          )}
        </div>

        {/* Certificações */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-display text-headline-sm text-on-surface">
              Certificações
            </h3>
            <Link
              href={ROUTES.CERTIFICATES}
              className="text-secondary hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Link>
          </div>
          {certificates.length > 0 ? (
            <div className="space-y-3">
              {certificates.slice(0, 5).map((cert) => (
                <div
                  key={cert.id}
                  className="p-3 bg-surface border border-outline-variant rounded-xl flex items-center justify-between group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium font-sans text-label-md text-on-surface truncate">
                      {cert.title}
                    </p>
                    <p className="text-[12px] text-secondary font-sans">
                      {cert.issuer}
                    </p>
                    <p className="text-[10px] text-secondary font-sans">
                      {formatDate(cert.issueDate, 'MM/yyyy')}
                      {cert.expirationDate && ` — ${formatDate(cert.expirationDate, 'MM/yyyy')}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:text-primary transition-colors"
                        title="Ver credencial"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          type: 'certificate',
                          id: cert.id,
                          label: cert.title,
                        })
                      }
                      className="opacity-0 group-hover:opacity-100 text-secondary hover:text-error transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {certificates.length > 5 && (
                <Link
                  href={ROUTES.CERTIFICATES}
                  className="text-primary font-display text-label-sm hover:underline block text-center mt-2"
                >
                  Ver todas ({certificates.length})
                </Link>
              )}
            </div>
          ) : (
            <EmptyState
              icon={BadgeCheck}
              title="Nenhuma certificação"
              description="Adicione suas certificações."
              actionLabel="Adicionar Certificação"
              onAction={() => router.push(ROUTES.CERTIFICATES)}
            />
          )}
        </div>

        {/* Formação */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1 md:col-span-2">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-display text-headline-sm text-on-surface">
              Formação Acadêmica
            </h3>
            <Link
              href={ROUTES.EDUCATION}
              className="text-secondary hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Link>
          </div>
          {education.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {education.slice(0, 4).map((edu) => (
                <div
                  key={edu.id}
                  className="flex gap-4 p-4 rounded-xl bg-surface border border-outline-variant group"
                >
                  <div className="h-12 w-12 bg-primary-container/10 rounded-full flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold font-sans text-on-surface text-body-sm">
                          {edu.course}
                        </h4>
                        <p className="text-on-surface-variant font-sans text-body-sm">
                          {edu.institution}
                        </p>
                        <p className="text-[12px] text-secondary">
                          {EducationLevel[edu.educationLevel as unknown as number] || edu.educationLevel}
                          {' • '}
                          {EducationStatus[edu.status as unknown as number] || edu.status}
                        </p>
                        <p className="text-[12px] text-secondary flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(edu.startDate, 'yyyy')} —{' '}
                          {edu.isCurrent ? 'Presente' : formatDate(edu.endDate, 'yyyy')}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            type: 'education',
                            id: edu.id,
                            label: `${edu.course} - ${edu.institution}`,
                          })
                        }
                        className="opacity-0 group-hover:opacity-100 text-secondary hover:text-error transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={GraduationCap}
              title="Nenhuma formação"
              description="Adicione sua formação acadêmica."
              actionLabel="Adicionar Formação"
              onAction={() => router.push(ROUTES.EDUCATION)}
            />
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title={`Remover ${deleteDialog.type === 'skill' ? 'habilidade' : deleteDialog.type === 'experience' ? 'experiência' : deleteDialog.type === 'education' ? 'formação' : deleteDialog.type === 'language' ? 'idioma' : 'certificação'}`}
        description={`Tem certeza que deseja remover "${deleteDialog.label}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        variant="destructive"
        onConfirm={handleDelete}
        loading={
          deleteSkill.isPending || deleteExperience.isPending || deleteEducation.isPending || deleteLanguage.isPending || deleteCertificate.isPending
        }
      />
    </div>
  );
}