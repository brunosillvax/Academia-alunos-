'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../components/ui/Sidebar';
import { Topbar } from '../components/ui/Topbar';
import { Card, CardBody } from '../components/ui/Card';
import { api } from '../lib/api';

interface Plan {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
  _count?: { payments: number };
}

export default function PlansPage() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, durationInDays: 30 });
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      const me = await api('/auth/me');
      const user = me?.user;
      if (!user) return router.replace('/login');
      if (user.role !== 'ADMIN') return router.replace('/student');
      setLoading(false);
      loadPlans();
    } catch {
      router.replace('/login');
    }
  };

  const loadPlans = async () => {
    try {
      const data = await api('/plans');
      setPlans(data);
    } catch (err) {
      console.error('Erro ao carregar planos:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceInCents = Math.round(formData.price * 100);
    try {
      if (editingPlan) {
        await api(`/plans/${editingPlan.id}`, { method: 'PUT', json: { ...formData, price: priceInCents } });
      } else {
        await api('/plans', { method: 'POST', json: { ...formData, price: priceInCents } });
      }
      setShowModal(false);
      setEditingPlan(null);
      setFormData({ name: '', price: 0, durationInDays: 30 });
      loadPlans();
    } catch (err) {
      console.error('Erro ao salvar plano:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este plano?')) return;
    try {
      await api(`/plans/${id}`, { method: 'DELETE' });
      loadPlans();
    } catch (err) {
      console.error('Erro ao excluir plano:', err);
    }
  };

  const openModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({ name: plan.name, price: plan.price / 100, durationInDays: plan.durationInDays });
    } else {
      setEditingPlan(null);
      setFormData({ name: '', price: 0, durationInDays: 30 });
    }
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="rounded-xl border border-dark-border bg-white p-8 text-center shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar active="plans" />
        <div className="flex-1 min-w-0">
          <Topbar
            title="Planos"
            subtitle="Gerencie os planos de assinatura"
            right={
              <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Plano
              </button>
            }
          />

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Planos de Assinatura</h2>
                <p className="text-text-secondary">Gerencie e personalize os planos disponíveis para os alunos</p>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="rounded-2xl border border-dark-border bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openModal(plan)} 
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(plan.id)} 
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-text-primary mb-2">{plan.name}</h3>
                      
                      <div className="mb-4">
                        <div className="text-3xl font-bold text-primary">
                          R$ {(plan.price / 100).toFixed(2)}
                        </div>
                        <div className="text-sm text-text-secondary">
                          por {plan.durationInDays} dias
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-dark-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm text-text-secondary">{plan._count?.payments || 0} assinaturas</span>
                          </div>
                          <div className="text-sm text-text-secondary">
                            {Math.floor(plan.durationInDays / 30)} meses
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {plans.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-1">Nenhum plano cadastrado</h3>
                  <p className="text-text-secondary mb-6">Comece criando seu primeiro plano de assinatura</p>
                  <button 
                    onClick={() => openModal()} 
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Criar Plano
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
              <div className="rounded-2xl border border-dark-border bg-white shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">{editingPlan ? 'Editar Plano' : 'Novo Plano'}</h2>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Nome do Plano</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                        placeholder="Ex: Mensal, Trimestral" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Preço (R$)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={formData.price} 
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} 
                        className="w-full px-4 py-3 rounded-xl border border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Duração (dias)</label>
                      <input 
                        type="number" 
                        value={formData.durationInDays} 
                        onChange={(e) => setFormData({ ...formData, durationInDays: parseInt(e.target.value) })} 
                        className="w-full px-4 py-3 rounded-xl border border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                        required 
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowModal(false)} 
                        className="flex-1 px-4 py-3 rounded-xl border border-dark-border text-text-primary font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}