'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Award,
  Calendar,
  ExternalLink,
  Shield,
  Save,
  Loader2,
  X,
  Info,
  Clock,
} from 'lucide-react';
import {
  useCertificates,
  useCreateCertificate,
  useUpdateCertificate,
  useDeleteCertificate,
} from '@/hooks';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatDate } from '@/lib/formatters';
import { ROUTES, LIMITS } from '@/lib/constants';

interface CertificateFormData {
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  certificateId: string;
  credentialId: string;
  credentialUrl: string;
}

const initialFormData: CertificateFormData = {
  title: '',
  issuer: '',
  issueDate: '',
  expirationDate: '',
  certificateId: '',
  credentialId: '',
  credentialUrl: '',
};

export default function CertificatesPage() {
  const { data: certificatesData, isLoading, isError, refetch } = useCertificates();
  const createCertificate = useCreateCertificate();
  const updateCertificate = useUpdateCertificate();
  const deleteCertificate = useDeleteCertificate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CertificateFormData>(initialFormData);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    label: string;
  }>({ open: false, id: '', label: '' });

  const certificates = certificatesData?.data || [];

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: (typeof certificates)[0]) => {
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      expirationDate: cert.expirationDate ? cert.expirationDate.split('T')[0] : '',
      certificateId: cert.certificateId || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
    });
    setEditingId(cert.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuer.trim() || !formData.issueDate) return;

    const payload = {
      title: formData.title.trim(),
      issuer: formData.issuer.trim(),
      issueDate: new Date(formData.issueDate).toISOString(),
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : undefined,
      certificateId: formData.certificateId.trim() || undefined,
      credentialId: formData.credentialId.trim() || undefined,
      credentialUrl: formData.credentialUrl.trim() || undefined,
    };

    try {
      if (editingId) {
        await updateCertificate.mutateAsync({ id: editingId, data: payload });
      } else {
        await createCertificate.mutateAsync(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      // Erro já tratado no hook
    }
  };

  const handleDelete = () => {
    deleteCertificate.mutate(deleteDialog.id);
    setDeleteDialog({ open: false, id: '', label: '' });
  };

  const isExpired = (expirationDate: string | null) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  if (isLoading) {
    return <LoadingState message="Carregando certificados..." size="lg" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar certificados"
        message="Não foi possível carregar a lista de certificados."
        onRetry={() => refetch()}
      />
    );
  }

  const isSaving = createCertificate.isPending || updateCertificate.isPending;

  return (
    <div className="flex flex-col gap-lg">
      <PageHeader
        title="Certificados"
        description={`Gerencie suas certificações profissionais. (${certificates.length}/${LIMITS.CERTIFICATES_MAX})`}
      >
        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Adicionar Certificado
        </button>
      </PageHeader>

      {/* Lista de Certificados */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-level-1 hover:border-primary/30 transition-all group flex gap-lg"
            >
              {/* Ícone */}
              <div className="h-12 w-12 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <h4 className="font-display text-label-md font-bold text-on-surface">
                      {cert.title}
                    </h4>
                    <p className="font-sans text-body-sm text-primary font-medium">
                      {cert.issuer}
                    </p>
                    <div className="flex items-center gap-sm mt-1 flex-wrap">
                      <span className="text-[12px] text-secondary flex items-center gap-1 font-sans">
                        <Calendar className="h-3 w-3" />
                        {formatDate(cert.issueDate)}
                        {cert.expirationDate && ` — ${formatDate(cert.expirationDate)}`}
                      </span>
                      {cert.expirationDate && (
                        <span
                          className={`text-[12px] font-medium font-sans px-2 py-0.5 rounded-full ${
                            isExpired(cert.expirationDate)
                              ? 'bg-error-container text-error'
                              : cert.isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-surface-container-high text-secondary'
                          }`}
                        >
                          {isExpired(cert.expirationDate) ? 'Expirado' : 'Ativo'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-sm opacity-0 group-hover:opacity-100 transition-all shrink-0">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                        title="Ver credencial"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleOpenEdit(cert)}
                      className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          id: cert.id,
                          label: cert.title,
                        })
                      }
                      className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-container transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* IDs */}
                {(cert.certificateId || cert.credentialId) && (
                  <div className="mt-2 flex flex-wrap gap-x-md gap-y-1">
                    {cert.certificateId && (
                      <span className="text-[11px] text-secondary font-mono">
                        ID: {cert.certificateId}
                      </span>
                    )}
                    {cert.credentialId && (
                      <span className="text-[11px] text-secondary font-mono">
                        Credencial: {cert.credentialId}
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
          icon={Award}
          title="Nenhum certificado cadastrado"
          description="Adicione suas certificações para destacar suas qualificações."
          actionLabel="Adicionar Certificado"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal de Adicionar/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface w-full max-w-2xl max-h-[90vh] rounded-xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-headline-sm text-on-surface">
                    {editingId ? 'Editar Certificação' : 'Adicionar Certificação'}
                  </h2>
                  <p className="font-sans text-body-sm text-on-surface-variant">
                    Destaque suas conquistas profissionais e habilidades validadas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="p-xs hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-lg custom-scrollbar">
              <div className="grid grid-cols-12 gap-y-lg gap-x-gutter">
                {/* Informações Básicas */}
                <div className="col-span-12 flex items-center gap-xs mb-xs">
                  <span className="font-display text-label-sm text-primary uppercase tracking-wider">
                    Informações Básicas
                  </span>
                  <div className="flex-1 h-px bg-outline-variant ml-sm" />
                </div>

                {/* Título */}
                <div className="col-span-12">
                  <label className="block font-display text-label-md text-on-surface mb-xs">
                    Título do Certificado
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: AWS Certified Solutions Architect"
                    className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Emissor */}
                <div className="col-span-12">
                  <label className="block font-display text-label-md text-on-surface mb-xs">
                    Emissor / Organização
                  </label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="Ex: Amazon Web Services (AWS)"
                    className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Datas */}
                <div className="col-span-12 md:col-span-6">
                  <label className="block font-display text-label-md text-on-surface mb-xs">
                    Data de Emissão
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className="block font-display text-label-md text-on-surface mb-xs flex items-center justify-between">
                    Data de Expiração
                    <span className="font-sans text-body-sm text-outline font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Credenciais */}
                <div className="col-span-12 mb-xs mt-md flex items-center gap-xs">
                  <span className="font-display text-label-sm text-primary uppercase tracking-wider">
                    Credenciais de Verificação
                  </span>
                  <div className="flex-1 h-px bg-outline-variant ml-sm" />
                </div>

                <div className="col-span-12 md:col-span-6">
                  <label className="block font-display text-label-md text-on-surface mb-xs">
                    ID do Certificado
                  </label>
                  <input
                    type="text"
                    value={formData.certificateId}
                    onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })}
                    placeholder="Ex: CERT-123456"
                    maxLength={100}
                    className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className="block font-display text-label-md text-on-surface mb-xs">
                    ID da Credencial
                  </label>
                  <input
                    type="text"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="Ex: AWS-ARCH-99"
                    maxLength={100}
                    className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* URL */}
                <div className="col-span-12">
                  <label className="block font-display text-label-md text-on-surface mb-xs">
                    URL da Credencial
                  </label>
                  <div className="flex items-center">
                    <div className="h-11 px-md bg-surface-container flex items-center border border-r-0 border-outline-variant rounded-l-lg text-on-surface-variant font-sans text-body-sm">
                      https://
                    </div>
                    <input
                      type="text"
                      value={formData.credentialUrl}
                      onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                      placeholder="www.certificadora.com/validar/seu-id"
                      maxLength={500}
                      className="flex-1 h-11 px-md bg-white border border-outline-variant rounded-r-lg font-sans text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <p className="mt-xs font-sans text-body-sm text-on-surface-variant italic flex items-center gap-xs">
                    <Info className="h-3.5 w-3.5" />
                    Recrutadores clicam em links verificados 3x mais do que em texto simples.
                  </p>
                </div>

                {/* Preview */}
                <div className="col-span-12 mt-md">
                  <div className="p-lg bg-surface-container-low rounded-xl border border-dashed border-outline-variant flex flex-col items-center gap-md">
                    <div className="w-full flex justify-between items-start">
                      <div className="flex items-center gap-md">
                        <div className="w-16 h-16 bg-white border border-outline-variant rounded-lg flex items-center justify-center p-xs shadow-level-1">
                          <Award className="h-8 w-8 text-primary/40" />
                        </div>
                        <div>
                          <div className="font-display text-headline-sm text-on-surface leading-tight">
                            {formData.title || 'Visualização da Credencial'}
                          </div>
                          <div className="font-sans text-body-sm text-on-surface-variant">
                            {formData.issuer || 'O nome da empresa aparecerá aqui'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-px bg-outline-variant/30" />
                    <div className="w-full grid grid-cols-2 gap-sm">
                      <div className="font-display text-label-sm text-outline uppercase">
                        Emitido em:{' '}
                        <span className="text-on-surface font-semibold">
                          {formData.issueDate
                            ? formatDate(formData.issueDate)
                            : '--/--/----'}
                        </span>
                      </div>
                      <div className="font-display text-label-sm text-outline uppercase">
                        ID:{' '}
                        <span className="text-on-surface font-semibold">
                          {formData.certificateId || 'Não informado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="px-lg py-md border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center">
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="px-lg py-sm rounded-lg font-display text-label-md border border-outline-variant text-secondary hover:bg-surface-container transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving || !formData.title.trim() || !formData.issuer.trim() || !formData.issueDate}
                className="px-xl py-sm rounded-lg font-display text-label-md bg-primary text-white hover:bg-primary-container transition-all shadow-md active:scale-[0.98] flex items-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingId ? 'Atualizar Certificado' : 'Confirmar e Adicionar'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="Remover certificado"
        description={`Tem certeza que deseja remover "${deleteDialog.label}"?`}
        confirmLabel="Remover"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleteCertificate.isPending}
      />
    </div>
  );
}