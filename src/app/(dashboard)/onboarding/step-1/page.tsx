'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  Camera,
  Upload,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { profileSchema, type ProfileFormData } from '@/lib/validators';
import { useProfile, useCreateProfile, useUpdateProfile, useUploadPhoto } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import { LIMITS } from '@/lib/constants';
import { formatPhone } from '@/lib/formatters';

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export default function OnboardingStep1Page() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: profileData } = useProfile();
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const uploadPhoto = useUploadPhoto();

  const existingProfile = profileData?.data;
  const isEditing = !!existingProfile;

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    existingProfile?.photoUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: existingProfile?.phone || '',
      city: existingProfile?.city || '',
      state: existingProfile?.state || '',
      birthDate: existingProfile?.birthDate
        ? existingProfile.birthDate.split('T')[0]
        : '',
      currentPosition: existingProfile?.currentPosition || '',
      currentCompany: existingProfile?.currentCompany || '',
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '');
    let formatted = '';

    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 7) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }

    setValue('phone', formatted);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > LIMITS.PHOTO_MAX_SIZE) {
      alert('Foto deve ter no máximo 5MB');
      return;
    }

    if (!LIMITS.PHOTO_ACCEPTED_TYPES.includes(file.type)) {
      alert('Formato inválido. Use JPG, PNG ou WebP.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Se tem foto selecionada, faz upload primeiro
      if (selectedFile) {
        await uploadPhoto.mutateAsync(selectedFile);
      }

      // Cria ou atualiza perfil
      if (isEditing) {
        await updateProfile.mutateAsync(data);
      } else {
        await createProfile.mutateAsync(data);
      }

      router.push(ROUTES.ONBOARDING_STEP2);
    } catch {
      // Erro já tratado no hook
    }
  };

  const isLoading = createProfile.isPending || updateProfile.isPending || uploadPhoto.isPending;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-margin-mobile">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 -z-10 p-margin-desktop opacity-10 hidden lg:block">
        <Briefcase className="h-[200px] w-[200px]" />
      </div>
      <div className="fixed bottom-0 left-0 -z-10 p-margin-desktop opacity-10 hidden lg:block">
        <User className="h-[150px] w-[150px]" />
      </div>

      <main className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-headline-md font-bold text-primary tracking-tight">
            CareerFlow
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-level-1 p-lg md:p-xl">
          {/* Progress Indicator */}
          <div className="flex flex-col items-center mb-xl">
            <span className="font-display text-label-md text-secondary mb-base">
              Passo 1 de 3
            </span>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary progress-step-active shadow-[0_0_12px_rgba(79,70,229,0.3)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            </div>
          </div>

          <div className="mb-lg">
            <h2 className="font-display text-headline-sm text-on-surface mb-xs">
              Dados Pessoais
            </h2>
            <p className="font-sans text-body-md text-on-surface-variant">
              Vamos começar a construir seu perfil profissional de destaque.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
            {/* Photo Upload */}
            <div className="flex items-center gap-lg py-sm">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-outline" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <span className="font-display text-label-md text-on-surface">
                  Foto de Perfil
                </span>
                <p className="text-[12px] text-on-surface-variant leading-tight max-w-[160px]">
                  JPG ou PNG de alta resolução recomendado.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-xs text-primary font-display text-label-md hover:underline text-left"
                >
                  <Upload className="h-4 w-4 inline mr-1" />
                  Upload
                </button>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {/* Phone */}
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="phone"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    id="phone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    {...register('phone')}
                    onChange={(e) => {
                      register('phone').onChange(e);
                      handlePhoneChange(e);
                    }}
                    className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.phone ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-body-sm text-error">{errors.phone.message}</p>
                )}
              </div>

              {/* Birth Date */}
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="birthDate"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Data de Nascimento
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    id="birthDate"
                    type="date"
                    {...register('birthDate')}
                    className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.birthDate ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                </div>
                {errors.birthDate && (
                  <p className="text-body-sm text-error">{errors.birthDate.message}</p>
                )}
              </div>

              {/* State */}
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="state"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Estado
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <select
                    id="state"
                    {...register('state')}
                    className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none ${
                      errors.state ? 'border-error' : 'border-outline-variant'
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {brazilianStates.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.state && (
                  <p className="text-body-sm text-error">{errors.state.message}</p>
                )}
              </div>

              {/* City */}
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="city"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Cidade
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    id="city"
                    type="text"
                    placeholder="Ex: São Paulo"
                    {...register('city')}
                    className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.city ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                </div>
                {errors.city && (
                  <p className="text-body-sm text-error">{errors.city.message}</p>
                )}
              </div>

              {/* Current Position */}
              <div className="flex flex-col gap-xs md:col-span-1">
                <label
                  htmlFor="currentPosition"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Cargo Atual
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    id="currentPosition"
                    type="text"
                    placeholder="Ex: UX Designer"
                    {...register('currentPosition')}
                    className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.currentPosition ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                </div>
                {errors.currentPosition && (
                  <p className="text-body-sm text-error">{errors.currentPosition.message}</p>
                )}
              </div>

              {/* Current Company */}
              <div className="flex flex-col gap-xs md:col-span-1">
                <label
                  htmlFor="currentCompany"
                  className="font-display text-label-md text-on-surface-variant"
                >
                  Empresa Atual
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                  <input
                    id="currentCompany"
                    type="text"
                    placeholder="Ex: Tech Solutions"
                    {...register('currentCompany')}
                    className={`w-full pl-10 pr-4 py-sm rounded-lg bg-white border text-on-surface font-sans text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.currentCompany ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                </div>
                {errors.currentCompany && (
                  <p className="text-body-sm text-error">{errors.currentCompany.message}</p>
                )}
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
                    PRÓXIMO
                    <ArrowRight className="h-4 w-4" />
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
      </main>
    </div>
  );
}