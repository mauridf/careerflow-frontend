'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Share2,
  Globe,
  Lock,
  BarChart3,
  Loader2,
  X,
  Copy,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  useResume,
  useResumeAnalytics,
  useShareResume,
  usePublishResume,
  useUnpublishResume,
  useDownloadPdf,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, formatPhone } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const TEMPLATES = [
  { id: 'modern', label: 'Moderno', premium: false },
  { id: 'classic', label: 'Clássico', premium: true },
  { id: 'minimal', label: 'Minimalista', premium: true },
  { id: 'ats', label: 'ATS Standard', premium: false },
] as const;

type TemplateId = (typeof TEMPLATES)[number]['id'];

export default function ResumePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const {
    data: resumeData,
    isLoading: resumeLoading,
    isError: resumeError,
    refetch: refetchResume,
  } = useResume();

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
  } = useResumeAnalytics();

  const shareResume = useShareResume();
  const publishResume = usePublishResume();
  const unpublishResume = useUnpublishResume();
  const downloadPdf = useDownloadPdf();

  const resume = resumeData?.data;
  const analytics = analyticsData?.data;
  const isPublished = analytics?.status === 'Published';

  if (resumeLoading || analyticsLoading) {
    return <LoadingState message="Carregando currículo..." size="lg" />;
  }

  if (resumeError) {
    return (
      <ErrorState
        title="Erro ao carregar currículo"
        message="Não foi possível carregar os dados do currículo."
        onRetry={() => refetchResume()}
      />
    );
  }

  if (!resume) {
    return (
      <EmptyState
        icon={FileText}
        title="Nenhum currículo encontrado"
        description="Complete seu perfil e adicione experiências, formação e habilidades para gerar seu currículo."
        actionLabel="Ir para Perfil"
        onAction={() => window.location.href = ROUTES.PROFILE}
      />
    );
  }

  const { person } = resume;
  const hasData = resume.experiences.length > 0 || resume.educations.length > 0 || resume.skills.length > 0;

  const handleShare = () => {
    shareResume.mutate(undefined, {
      onSuccess: () => setIsShareModalOpen(true),
    });
  };

  const handleCopyLink = () => {
    if (shareResume.data?.data?.shareLink) {
      navigator.clipboard.writeText(shareResume.data.data.shareLink);
    }
  };

  const handleTogglePublish = () => {
    if (isPublished) {
      unpublishResume.mutate();
    } else {
      publishResume.mutate();
    }
  };

  return (
    <div className="flex flex-col gap-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-md">
          <Link
            href={ROUTES.DASHBOARD}
            className="text-secondary hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-headline-md text-slate-900 font-display">Meu Currículo</h1>
            <div className="flex items-center gap-sm mt-1">
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm font-display',
                isPublished
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              )}>
                {isPublished ? (
                  <Globe className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                {isPublished ? 'Publicado' : 'Rascunho'}
              </span>
              {analytics && (
                <span className="text-label-sm text-slate-400">
                  {analytics.completionPercentage}% completo
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePublish}
            disabled={publishResume.isPending || unpublishResume.isPending}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display text-label-md transition-all',
              isPublished
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                : 'bg-primary text-white hover:opacity-90'
            )}
          >
            {(publishResume.isPending || unpublishResume.isPending) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPublished ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            {isPublished ? 'Despublicar' : 'Publicar'}
          </button>
          <Link
            href={ROUTES.DASHBOARD + '?tab=analytics'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display text-label-md text-secondary hover:bg-surface-container-low transition-all border border-outline-variant"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Sticky Actions Bar */}
      <div className="sticky top-20 z-30 bg-white border border-outline-variant rounded-xl p-3 flex items-center gap-2 flex-wrap shadow-sm">
        <button
          onClick={handleShare}
          disabled={shareResume.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display text-label-md bg-primary text-white hover:opacity-90 transition-all"
        >
          {shareResume.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          Compartilhar
        </button>

        <button
          onClick={() => downloadPdf.mutate('standard')}
          disabled={downloadPdf.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display text-label-md text-secondary hover:bg-surface-container-low transition-all border border-outline-variant"
        >
          {downloadPdf.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download PDF
        </button>

        <button
          onClick={() => downloadPdf.mutate('ats')}
          disabled={downloadPdf.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display text-label-md text-secondary hover:bg-surface-container-low transition-all border border-outline-variant"
        >
          {downloadPdf.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Download PDF ATS
        </button>

        <div className="hidden sm:flex items-center gap-2 ml-auto">
          <button
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
            className="p-2 rounded-lg text-secondary hover:bg-surface-container-low transition-all"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-label-sm text-secondary font-display min-w-[3rem] text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
            className="p-2 rounded-lg text-secondary hover:bg-surface-container-low transition-all"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Template Sidebar */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="bg-white border border-outline-variant rounded-xl p-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-label-md font-semibold text-slate-900">Templates</h3>
              <span className="text-label-sm text-primary font-display cursor-pointer hover:underline">
                +3 templates
              </span>
            </div>
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={cn(
                    'flex-shrink-0 w-40 lg:w-full p-3 rounded-xl border-2 transition-all text-left',
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant hover:border-primary/50'
                  )}
                >
                  <div className="aspect-[3/4] rounded-lg bg-surface-container-low flex items-center justify-center mb-2">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-label-sm text-slate-900">{template.label}</span>
                    {template.premium && (
                      <span className="text-[10px] font-display font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="lg:col-span-9 order-1 lg:order-2">
          {!hasData ? (
            <EmptyState
              icon={FileText}
              title="Currículo vazio"
              description="Adicione experiências, formação e habilidades para começar."
              actionLabel="Editar Perfil"
              onAction={() => window.location.href = ROUTES.PROFILE}
            />
          ) : (
            <div
              className="flex justify-center transition-all duration-300"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div className="w-full max-w-[210mm] bg-white shadow-lg border border-slate-200">
                {/* A4 Resume Document */}
                <div className="p-[40px]">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-1">
                      {person.name}
                    </h1>
                    {person.currentPosition && (
                      <p className="text-lg text-primary font-semibold uppercase tracking-widest mb-2">
                        {person.currentPosition}
                        {person.currentCompany && ` - ${person.currentCompany}`}
                      </p>
                    )}
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-600">
                      {person.email && <span>{person.email}</span>}
                      {person.phone && <span>{formatPhone(person.phone)}</span>}
                      {person.city && (
                        <span>{person.city}{person.state ? `/${person.state}` : ''}</span>
                      )}
                    </div>
                  </div>

                  <div className="h-[2px] bg-primary mb-6" />

                  {/* Professional Summary */}
                  {person.professionalSummary && (
                    <div className="mb-6">
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Resumo Profissional
                      </h2>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {person.professionalSummary}
                      </p>
                    </div>
                  )}

                  {/* Professional Experience */}
                  {resume.experiences.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                        Experiência Profissional
                      </h2>
                      <div className="space-y-4">
                        {resume.experiences.map((exp, idx) => (
                          <div key={idx}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                  {exp.position}
                                </h3>
                                <p className="text-sm text-slate-700">{exp.companyName}</p>
                              </div>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {formatDate(exp.startDate, 'MMM/yyyy')} - {exp.isCurrent ? 'Atual' : formatDate(exp.endDate!, 'MMM/yyyy')}
                                {exp.durationFormatted && ` (${exp.durationFormatted})`}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                            {exp.employmentType && (
                              <span className="text-xs text-slate-400 mt-1 block">
                                {exp.employmentType}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {resume.educations.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                        Formação Acadêmica
                      </h2>
                      <div className="space-y-3">
                        {resume.educations.map((edu, idx) => (
                          <div key={idx}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900">{edu.course}</h3>
                                <p className="text-sm text-slate-700">{edu.institution}</p>
                              </div>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {formatDate(edu.startDate, 'yyyy')} - {edu.endDate ? formatDate(edu.endDate, 'yyyy') : 'Atual'}
                              </span>
                            </div>
                            <div className="flex gap-3 mt-1">
                              <span className="text-xs text-slate-500">{edu.level}</span>
                              <span className="text-xs text-slate-500">{edu.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills + Languages + Certificates - Two Columns */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Skills */}
                    {resume.skills.length > 0 && (
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                          Habilidades
                        </h2>
                        <div className="space-y-2">
                          {resume.skills.map((skill, idx) => (
                            <div key={idx}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-700 font-medium">
                                  {skill.name}
                                  {skill.isPrimary && (
                                    <span className="text-primary ml-1">*</span>
                                  )}
                                </span>
                                <span className="text-xs text-slate-500">{skill.level}</span>
                              </div>
                              <div className="mt-1 h-[6px] bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${skill.score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages & Certificates */}
                    <div className="space-y-6">
                      {resume.languages.length > 0 && (
                        <div>
                          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                            Idiomas
                          </h2>
                          <div className="space-y-1">
                            {resume.languages.map((lang, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm text-slate-700">
                                  {lang.languageName}
                                  {lang.isNative && (
                                    <span className="text-xs text-slate-400 ml-1">(Nativo)</span>
                                  )}
                                </span>
                                <span className="text-xs text-slate-500">{lang.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resume.certificates.length > 0 && (
                        <div>
                          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                            Certificações
                          </h2>
                          <div className="space-y-2">
                            {resume.certificates.slice(0, 5).map((cert, idx) => (
                              <div key={idx}>
                                <p className="text-sm text-slate-700 font-medium">{cert.title}</p>
                                <p className="text-xs text-slate-500">
                                  {cert.issuer} - {formatDate(cert.issueDate, 'yyyy')}
                                </p>
                              </div>
                            ))}
                            {resume.certificates.length > 5 && (
                              <p className="text-xs text-primary font-medium">
                                +{resume.certificates.length - 5} certificações
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Networks */}
                  {resume.socialNetworks.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Redes Sociais
                      </h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {resume.socialNetworks.map((sn, idx) => (
                          <a
                            key={idx}
                            href={sn.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {sn.networkType}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsShareModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-lg">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-headline-sm text-slate-900">Compartilhar Currículo</h3>
                  <p className="text-body-sm text-slate-500">Compartilhe seu currículo com recrutadores</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-secondary hover:text-primary p-1 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Share Link */}
            <div className="mb-lg">
              <label className="font-display text-label-sm text-slate-700 mb-2 block">
                Link público do currículo
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-lg border border-outline-variant bg-slate-50 text-sm text-slate-700 font-mono truncate">
                  {shareResume.data?.data?.shareLink || `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${person.resumeSlug}`}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-lg bg-primary text-white hover:opacity-90 transition-all"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Social Share */}
            <div>
              <label className="font-display text-label-sm text-slate-700 mb-2 block">
                Compartilhar em
              </label>
              <div className="flex gap-3">
                {[
                  { icon: '💼', label: 'LinkedIn' },
                  { icon: '📘', label: 'Facebook' },
                  { icon: '🐦', label: 'Twitter' },
                  { icon: '📱', label: 'WhatsApp' },
                  { icon: '📧', label: 'Email' },
                ].map((social) => (
                  <button
                    key={social.label}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-surface-container-low transition-all border border-outline-variant flex-1"
                  >
                    <span className="text-xl">{social.icon}</span>
                    <span className="text-[10px] text-slate-500 font-display">{social.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-lg pt-lg border-t border-outline-variant flex items-center justify-end gap-3">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 rounded-lg font-display text-label-md text-secondary hover:bg-surface-container-low transition-all"
              >
                Fechar
              </button>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg font-display text-label-md bg-primary text-white hover:opacity-90 transition-all"
              >
                Copiar Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
