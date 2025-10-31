'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/student/payments`, { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        router.push('/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error('Erro ao carregar pagamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="card-float p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0) / 100;
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
  const nextPayment = payments.find(p => p.status === 'PENDING' && new Date(p.expiresAt) > new Date());

  return (
    <div className="min-h-screen bg-dark">
      {/* Topbar */}
      <header className="h-16 bg-dark-sidebar/80 backdrop-blur border-b border-dark-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-text-primary">GymFlow</h2>
              <p className="text-xs text-text-secondary">Área do Aluno</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="/student" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">Meu Perfil</a>
            <a href="/student/evolution" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">Evolução</a>
            <a href="/student/payments" className="text-primary font-semibold text-sm">Pagamentos</a>
            <button onClick={handleLogout} className="btn-secondary text-sm">Sair</button>
          </nav>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Meus Pagamentos 💳</h1>
            <p className="text-text-secondary">Histórico completo de transações</p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                  ✅
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Total Pago</p>
                  <p className="text-2xl font-bold text-text-primary">R$ {totalPaid.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Total de Pagamentos</p>
                  <p className="text-2xl font-bold text-text-primary">{payments.length}</p>
                </div>
              </div>
            </div>

            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                  ⏳
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Pendentes</p>
                  <p className="text-2xl font-bold text-text-primary">{pendingPayments}</p>
                </div>
              </div>
            </div>

            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                  📅
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Próximo Vencimento</p>
                  <p className="text-lg font-bold text-text-primary">
                    {nextPayment ? new Date(nextPayment.expiresAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="card-float p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Histórico de Pagamentos</h2>
                <p className="text-sm text-text-secondary">Todas as suas transações</p>
              </div>
              <button className="btn-primary text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Exportar
              </button>
            </div>

            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Header */}
                  <div className="grid grid-cols-5 gap-4 pb-4 border-b border-dark-border font-semibold text-text-primary text-sm">
                    <div>Data</div>
                    <div>Plano</div>
                    <div>Vencimento</div>
                    <div>Status</div>
                    <div className="text-right">Valor</div>
                  </div>

                  {/* Rows */}
                  <div className="space-y-3 mt-4">
                    {payments.map((p: any, index: number) => (
                      <div
                        key={p.id}
                        className="grid grid-cols-5 gap-4 p-4 rounded-xl hover:bg-dark-hover transition-colors items-center"
                      >
                        <div className="text-sm text-text-primary">
                          {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-text-primary">{p.plan?.name || 'N/A'}</span>
                        </div>
                        <div className="text-sm text-text-secondary">
                          {new Date(p.expiresAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            p.status === 'PAID'
                              ? 'bg-accent-success/15 text-accent-success'
                              : p.status === 'PENDING'
                              ? 'bg-accent-warning/15 text-accent-warning'
                              : 'bg-accent-danger/15 text-accent-danger'
                          }`}>
                            {p.status === 'PAID' ? '✅ Pago' : p.status === 'PENDING' ? '⏳ Pendente' : '❌ Falhado'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-text-primary">R$ {(p.amount / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Nenhum Pagamento Registrado</h3>
                <p className="text-text-secondary">Seus pagamentos aparecerão aqui assim que forem processados.</p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-float p-6">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span>💳</span> Formas de Pagamento
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Aceitamos cartões de crédito, débito, Pix e boleto bancário.
              </p>
              <div className="flex gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                <div className="w-12 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                <div className="w-12 h-8 bg-gradient-to-r from-primary to-primary-light rounded flex items-center justify-center text-white text-xs font-bold">PIX</div>
              </div>
            </div>

            <div className="card-float p-6">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span>❓</span> Dúvidas?
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Entre em contato com nossa equipe para esclarecimentos sobre pagamentos.
              </p>
              <button className="btn-secondary text-sm">
                Falar com Suporte
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
