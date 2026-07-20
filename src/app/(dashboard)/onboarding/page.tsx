'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  Edit3,
  BarChart3,
  Share2,
  Users,
  Zap,
} from 'lucide-react';
import { useProfile } from '@/hooks';
import { ROUTES } from '@/lib/constants';

const features = [
  {
    icon: FileText,
    label: 'Currículo',
    color: 'bg-primary-fixed-dim text-primary',
  },
  {
    icon: Edit3,
    label: 'Personalize',
    color: 'bg-secondary-fixed-dim text-secondary',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    color: 'bg-tertiary-fixed-dim text-tertiary',
  },
  {
    icon: Share2,
    label: 'Compartilhe',
    color: 'bg-surface-variant text-on-surface-variant',
  },
];

export default function OnboardingWelcomePage() {
  const router = useRouter();
  const { data: profileData } = useProfile();
  const hasProfile = !!profileData?.data;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-margin-mobile">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-[120px]" />
      </div>

      <main className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Logo */}
        <div className="flex justify-center mb-xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-headline-sm font-bold text-primary tracking-tight">
              CareerFlow
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-1 p-lg md:p-xl">
          {/* Header */}
          <div className="text-center mb-xl">
            <h1 className="font-display text-headline-md md:text-display-lg-mobile text-on-surface font-bold tracking-tight mb-sm">
              🎉 Bem-vindo ao CareerFlow!
            </h1>
            <p className="font-sans text-body-md text-on-surface-variant max-w-md mx-auto">
              {hasProfile
                ? 'Continue configurando seu perfil para impulsionar sua carreira.'
                : 'Vamos configurar seu perfil em 3 passos para impulsionar sua carreira com inteligência de mercado.'}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="group flex flex-col items-center text-center p-md bg-surface border border-outline-variant rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-level-2"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-sm group-hover:scale-110 transition-transform duration-300 ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <span className="font-display text-label-md font-semibold text-on-surface">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {/* Illustration Area */}
          <div className="relative w-full aspect-[21/9] bg-surface-container-low rounded-lg border border-dashed border-outline-variant mb-xl overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 opacity-60">
                <Zap className="h-16 w-16 text-primary/30" />
                <span className="font-display text-label-sm uppercase tracking-widest text-primary/40">
                  Impulsionando sua carreira
                </span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            <div className="absolute -left-4 -top-4 w-48 h-48 bg-tertiary/5 rounded-full blur-3xl group-hover:bg-tertiary/10 transition-colors duration-500" />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-sm">
            <Link
              href={ROUTES.ONBOARDING_STEP1}
              className="w-full bg-primary-container text-white py-4 px-lg rounded-lg font-display text-body-md font-bold hover:bg-primary transition-all duration-200 active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
            >
              {hasProfile ? 'CONTINUAR' : 'COMEÇAR'}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={ROUTES.PROFILE}
              className="w-full bg-transparent text-secondary py-3 px-lg rounded-lg font-display text-label-md font-semibold hover:bg-surface-container-high transition-colors duration-200 text-center"
            >
              {hasProfile ? 'Ir para o Perfil' : 'Pular por enquanto'}
            </Link>
          </div>
        </div>

        {/* Footer Social Proof */}
        <div className="mt-lg flex justify-center items-center gap-4 text-on-secondary-fixed-variant">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary-container flex items-center justify-center">
              <Users className="h-4 w-4 text-on-primary-container" />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-secondary-container flex items-center justify-center">
              <Users className="h-4 w-4 text-on-secondary-container" />
            </div>
          </div>
          <p className="font-sans text-label-sm">
            Junte-se a <span className="font-bold text-primary">2.000+</span> profissionais hoje.
          </p>
        </div>
      </main>
    </div>
  );
}