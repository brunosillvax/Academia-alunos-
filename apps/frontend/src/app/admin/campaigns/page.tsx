'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/ui/Sidebar';
import { Topbar } from '../../components/ui/Topbar';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { api } from '../../lib/api';

interface Campaign {
  id: string;
  name: string;
  type: 'WHATSAPP' | 'EMAIL';
  segment: any;
  message: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  sentAt?: string;
  createdAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'WHATSAPP' as 'WHATSAPP' | 'EMAIL',
    message: '',
    segment: {
      missingDays: 7,
      hasOverduePayment: false,
      objective: '',
    },
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const me = await api('/auth/me');
      if (!me?.user || me.user.role !== 'ADMIN') {
        router.replace('/login');
        return;
      }
      loadCampaigns();
    } catch {
      router.replace('/login');
    }
  };

  const loadCampaigns = async () => {
    try {
      const data = await api('/campaigns');
      setCampaigns(data);
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/campaigns', {
        method: 'POST',
        json: formData,
      });
      setShowModal(false);
      setFormData({
        name: '',
        type: 'WHATSAPP',
        message: '',
        segment: {
          missingDays: 7,
          hasOverduePayment: false,
          objective: '',
        },
      });
      loadCampaigns();
    } catch (err) {
      console.error('Erro ao criar campanha:', err);
      alert('Erro ao criar campanha');
    }
  };

  const handleSend = async (id: string) => {
    if (!confirm('Deseja realmente enviar esta campanha?')) return;
    try {
      await api(`/campaigns/${id}/send`, { method: 'POST' });
      loadCampaigns();
    } catch (err) {
      alert('Erro ao enviar campanha');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-card to-dark flex">
      <Sidebar active="campaigns" />
      <div className="flex-1 flex flex-col">
        <Topbar
          title="Campanhas"
          subtitle="Disparo de WhatsApp e Email segmentado"
          right={
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Nova Campanha
            </button>
          }
        />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {campaigns.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <p className="text-text-secondary mb-4">Nenhuma campanha criada ainda</p>
                  <button onClick={() => setShowModal(true)} className="btn-primary">
                    Criar Primeira Campanha
                  </button>
                </CardBody>
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{campaign.name}</h3>
                        <p className="text-sm text-text-secondary">
                          {campaign.type} • Criada em {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          campaign.status === 'SENT' ? 'bg-green-500/10 text-green-400' :
                          campaign.status === 'SCHEDULED' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {campaign.status === 'SENT' ? 'Enviada' :
                           campaign.status === 'SCHEDULED' ? 'Agendada' : 'Rascunho'}
                        </span>
                        {campaign.status === 'DRAFT' && (
                          <button
                            onClick={() => handleSend(campaign.id)}
                            className="btn-primary text-sm"
                          >
                            Enviar Agora
                          </button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-2">Mensagem:</h4>
                        <p className="text-sm text-text-secondary bg-white/5 p-3 rounded-lg">
                          {campaign.message}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-2">Segmentação:</h4>
                        <div className="text-sm text-text-secondary bg-white/5 p-3 rounded-lg space-y-1">
                          {campaign.segment.missingDays && (
                            <p>• Faltou {campaign.segment.missingDays} dias</p>
                          )}
                          {campaign.segment.hasOverduePayment && (
                            <p>• Com pagamento em atraso</p>
                          )}
                          {campaign.segment.objective && (
                            <p>• Objetivo: {campaign.segment.objective}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Modal de Criação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-border">
              <h2 className="text-xl font-bold text-text-primary">Nova Campanha</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nome da Campanha</label>
                <input
                  className="input-modern"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Tipo</label>
                <select
                  className="input-modern"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'WHATSAPP' | 'EMAIL' })}
                >
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Mensagem</label>
                <textarea
                  className="input-modern h-32"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="Digite a mensagem que será enviada..."
                />
              </div>

              <div className="border-t border-dark-border pt-4">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Segmentação</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Alunos que faltaram (dias)
                    </label>
                    <input
                      type="number"
                      className="input-modern"
                      value={formData.segment.missingDays}
                      onChange={(e) => setFormData({
                        ...formData,
                        segment: { ...formData.segment, missingDays: parseInt(e.target.value) || 0 }
                      })}
                      min="1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="overdue"
                      checked={formData.segment.hasOverduePayment}
                      onChange={(e) => setFormData({
                        ...formData,
                        segment: { ...formData.segment, hasOverduePayment: e.target.checked }
                      })}
                    />
                    <label htmlFor="overdue" className="text-sm text-text-secondary">
                      Incluir alunos com pagamento em atraso
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Criar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
