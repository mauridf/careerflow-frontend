'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Location,
  Mail,
  Phone,
  Download,
  Share2,
  Check,
  ExternalLink,
  Linkedin,
  Github,
  Globe,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Link2,
  Calendar,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { resumeService } from '@/services';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { APP_URL } from '@/lib/constants';
import type { ResumeResponse } from '@/types';

export default function SharedResumePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [resume, setResume] = useState<ResumeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await resumeService.getSharedResume(slug);
        setResume(response.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const person = resume?.person;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async (type: 'standard' | 'ats') => {
    try {
      const endpoint = type === 'ats'
        ? `/resume/shared/${slug}/ats-pdf`
        : `/resume/shared/${slug}/pdf`;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'ats' ? 'curriculo-ats.pdf' : 'curriculo.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    }
  };

  if (loading) {
    return <LoadingState message="Carregando currículo..." size="lg" />;
  }

  if (error || !resume || !person) {
    return (
      <ErrorState
        title="Currículo não encontrado"
        message="O currículo que você está procurando não existe ou foi removido."
      />
    );
  }

  const experienceColors = ['#4f46e5', '#0891b2', '#7c3aed', '#059669', '#d97706'];

  return (
    <div className="min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Bar */}
      <nav className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant">
        <div className="flex justify-between items-center h-16 px-gutter max-w-[1280px] mx-auto">
          <div className="font-display text-headline-md font-bold text-primary">CareerFlow</div>
          <div className="flex items-center gap-md">
            <a
              href={`${APP_URL}/login`}
              className="hidden md:block text-secondary font-medium hover:text-primary transition-colors"
            >
              Entrar
            </a>
            <a
              href={`${APP_URL}/register`}
              className="bg-primary text-on-primary px-lg py-sm rounded-lg font-display text-label-md hover:opacity-90 transition-opacity"
            >
              Criar o meu
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-[900px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        {/* Profile Header */}
        <header className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl mb-xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-lg">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover border-4 border-surface shadow-md bg-surface-container flex items-center justify-center">
                {person.photoUrl ? (
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-primary font-display">
                    {person.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-display-lg-mobile md:text-display-lg text-on-surface mb-xs">
                {person.name?.toUpperCase() || 'Nome não informado'}
              </h1>
              {person.currentPosition && (
                <p className="font-display text-headline-sm text-primary mb-md">
                  {person.currentPosition}
                  {person.currentCompany && ` • ${person.currentCompany}`}
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-md text-on-surface-variant">
                {(person.city || person.state) && (
                  <div className="flex items-center gap-xs text-body-sm">
                    <MapPin className="h-4 w-4" />
                    {person.city && person.state
                      ? `${person.city}/${person.state}`
                      : person.city || person.state}
                  </div>
                )}
                {person.email && (
                  <div className="flex items-center gap-xs text-body-sm">
                    <Mail className="h-4 w-4" />
                    {person.email}
                  </div>
                )}
                {person.phone && (
                  <div className="flex items-center gap-xs text-body-sm">
                    <Phone className="h-4 w-4" />
                    {person.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-xl">
          {/* Professional Summary */}
          {person.professionalSummary && (
            <section>
              <div className="flex items-center gap-sm mb-lg">
                <span className="text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <h2 className="font-display text-headline-md text-on-surface uppercase tracking-wider">Resumo Profissional</h2>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                <p className="text-body-lg text-on-surface-variant leading-relaxed">
                  {person.professionalSummary}
                </p>
              </div>
            </section>
          )}

          {/* Experiences */}
          {resume.experiences.length > 0 && (
            <section>
              <div className="flex items-center gap-sm mb-lg">
                <Briefcase className="h-6 w-6 text-primary" />
                <h2 className="font-display text-headline-md text-on-surface uppercase tracking-wider">Experiência Profissional</h2>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>
              <div className="space-y-md">
                {resume.experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row justify-between mb-md">
                      <div>
                        <h3 className="font-display text-headline-sm text-on-surface">{exp.position}</h3>
                        <p className="font-display text-label-md text-primary">{exp.companyName}</p>
                      </div>
                      <span className="text-on-surface-variant font-display text-label-sm bg-surface-container px-sm py-xs rounded-full h-fit mt-xs md:mt-0">
                        {formatDate(exp.startDate, 'MMM/yyyy')} - {exp.isCurrent ? 'Presente' : formatDate(exp.endDate, 'MMM/yyyy')}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-body-md text-on-surface-variant mb-lg">{exp.description}</p>
                    )}
                    {exp.employmentType && (
                      <span className="text-label-sm text-secondary italic">{exp.employmentType}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills & Education Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
            {/* Education */}
            {resume.educations.length > 0 && (
              <section>
                <div className="flex items-center gap-sm mb-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-wider">Educação</h2>
                </div>
                <div className="space-y-md">
                  {resume.educations.map((edu, idx) => (
                    <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                      <h3 className="font-display text-label-md text-on-surface">{edu.course}</h3>
                      <p className="text-primary text-body-sm mb-base">{edu.institution}</p>
                      <p className="text-on-surface-variant text-body-sm">
                        {edu.level} &mdash; {formatDate(edu.startDate, 'yyyy')} a {edu.isCurrent ? 'Presente' : formatDate(edu.endDate, 'yyyy')}
                      </p>
                      <span className="inline-block mt-2 text-label-sm text-secondary font-display bg-surface-container px-2 py-0.5 rounded">
                        {edu.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <section>
                <div className="flex items-center gap-sm mb-lg">
                  <Award className="h-6 w-6 text-primary" />
                  <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-wider">Habilidades</h2>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-md">
                  {resume.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-xs">
                        <span className="font-display text-label-md text-on-surface font-semibold">
                          {skill.name}
                        </span>
                        <span className="text-primary font-display text-label-sm">{skill.score}%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Languages */}
          {resume.languages.length > 0 && (
            <section>
              <div className="flex items-center gap-sm mb-lg">
                <Languages className="h-6 w-6 text-primary" />
                <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-wider">Idiomas</h2>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>
              <div className="flex flex-wrap gap-md">
                {resume.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl px-lg py-md flex items-center gap-3"
                  >
                    <span className="font-display text-label-md text-on-surface font-semibold">
                      {lang.languageName}
                    </span>
                    <span className="text-label-sm text-secondary">{lang.level}</span>
                    {lang.isNative && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        NATIVO
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {resume.certificates.length > 0 && (
            <section>
              <div className="flex items-center gap-sm mb-lg">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-wider">Certificações</h2>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {resume.certificates.slice(0, 6).map((cert, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg"
                  >
                    <h3 className="font-display text-label-md text-on-surface font-semibold">{cert.title}</h3>
                    <p className="text-body-sm text-primary">{cert.issuer}</p>
                    <p className="text-label-sm text-secondary mt-1">Emissão: {formatDate(cert.issueDate)}</p>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-label-sm text-primary hover:underline mt-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Ver credencial
                      </a>
                    )}
                  </div>
                ))}
                {resume.certificates.length > 6 && (
                  <p className="text-body-sm text-secondary text-center col-span-full py-4">
                    + {resume.certificates.length - 6} certificados
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Social Networks */}
          {resume.socialNetworks.length > 0 && (
            <section>
              <div className="flex items-center gap-sm mb-lg">
                <Link2 className="h-6 w-6 text-primary" />
                <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-wider">Redes Sociais</h2>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>
              <div className="flex flex-wrap gap-md">
                {resume.socialNetworks.map((sn, idx) => (
                  <a
                    key={idx}
                    href={sn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl px-lg py-md flex items-center gap-3 hover:border-primary/30 transition-colors"
                  >
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="font-display text-label-md">{sn.networkType}</span>
                    <ExternalLink className="h-3 w-3 text-secondary" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Spacer for FAB */}
        <div className="h-32" />
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-lg left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[600px] z-40">
        <div className="bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface p-md rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-md border border-white/10">
          <div className="flex items-center gap-lg px-md text-surface-container">
            <div className="flex flex-col">
              <span className="font-display text-label-sm opacity-70">Visualizações</span>
              <span className="font-display text-headline-sm">—</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col">
              <span className="font-display text-label-sm opacity-70">Downloads</span>
              <span className="font-display text-headline-sm">—</span>
            </div>
          </div>
          <div className="flex gap-sm w-full md:w-auto">
            <button
              onClick={() => handleDownloadPdf('ats')}
              className="flex-1 md:flex-none flex items-center justify-center gap-xs bg-primary text-white px-lg py-sm rounded-lg font-display text-label-md hover:brightness-110 transition-all active:scale-95"
            >
              <Download className="h-4 w-4" />
              PDF ATS
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 md:flex-none flex items-center justify-center gap-xs bg-white/10 text-white px-lg py-sm rounded-lg font-display text-label-md hover:bg-white/20 transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-xl bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-[1280px] mx-auto gap-md">
          <div className="text-secondary text-body-sm">
            Criado com <span className="font-bold text-on-surface">CareerFlow</span> &mdash; ATS-Optimized Excellence.
          </div>
          <div className="flex items-center gap-lg">
            <a
              href={`${APP_URL}/register`}
              className="text-on-surface-variant hover:text-primary underline transition-all font-display text-label-sm"
            >
              Crie o seu grátis!
            </a>
            <span className="text-outline-variant">|</span>
            <p className="text-secondary text-body-sm">CareerFlow © 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
