'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../components/ui/Sidebar';
import { Topbar } from '../components/ui/Topbar';
import { Card, CardBody, CardHeader, StatCard } from '../components/ui/Card';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any | null>(null);
  const [funnelData, setFunnelData] = useState<any | null>(null);
  const [ltvChurnMrr, setLtvChurnMrr] = useState<any | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      loadData();
    }
  }, []);

  const loadData = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    try {
      const authRes = await fetch(`${api}/auth/me`, { credentials: 'include' });

      if (!authRes.ok) {
        console.log('Não autenticado');
        setLoading(false);
        setData({ totalAlunos: 0, faturamentoMes: 0, inadimplentes: 0 });
        return;
      }

      const userDataRaw = await authRes.json();
      const userData = userDataRaw?.user || null;
      console.log('Usuário logado:', userData);
      setUser(userData);

      if (userData?.role === 'ADMIN') {
        const [dashRes, funnelRes, ltvRes] = await Promise.all([
          fetch(`${api}/admin/dashboard`, { credentials: 'include' }),
          fetch(`${api}/admin/funnel`, { credentials: 'include' }),
          fetch(`${api}/admin/ltv-churn-mrr`, { credentials: 'include' }),
        ]);

        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setData(dashData);
        } else {
          setData({ totalAlunos: 0, faturamentoMes: 0, inadimplentes: 0 });
        }

        if (funnelRes.ok) {
          const funnel = await funnelRes.json();
          setFunnelData(funnel);
        }

        if (ltvRes.ok) {
          const ltv = await ltvRes.json();
          setLtvChurnMrr(ltv);
        }
      } else {
        setData({ totalAlunos: 0, faturamentoMes: 0, inadimplentes: 0 });
      }

      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setData({ totalAlunos: 0, faturamentoMes: 0, inadimplentes: 0 });
      setLoading(false);
    }
  };

  // Redireciona se for STUDENT
  useEffect(() => {
    if (!loading && user && user.role === 'STUDENT') {
      router.push('/student');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showActionMenu && !(e.target as Element).closest('.action-menu-container')) {
        setShowActionMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showActionMenu]);

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

  // Se for STUDENT, retorna null (o useEffect irá redirecionar)
  if (user && user.role === 'STUDENT') {
    return null;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="card-float p-8 text-center">
          <p className="text-text-secondary">Sem dados disponíveis</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total de Alunos',
      value: data?.totalAlunos ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      change: '+12.5%',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Faturamento',
      value: `R$ ${((data?.faturamentoMes ?? 0) / 100).toFixed(2)}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      change: '+8.2%',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Inadimplentes',
      value: data?.inadimplentes ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
      change: '-2.4%',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Taxa de Frequência',
      value: '87.5%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19V9a2 2 0 012-2h0a2 2 0 012 2v10m-6 0V5a2 2 0 012-2h0a2 2 0 012 2v14m6 0V9a2 2 0 012-2h0a2 2 0 012 2v10" />
        </svg>
      ),
      change: '+5.1%',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar active="dashboard" />
        <div className="flex-1 min-w-0">
          <Topbar
            title="Dashboard"
            subtitle="Bem-vindo de volta!"
            right={
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                    window.open(`${api}/admin/export/report?type=csv`, '_blank');
                  }}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar CSV
                </button>
                <div className="relative action-menu-container">
                  <button onClick={() => setShowActionMenu(!showActionMenu)} className="btn-primary text-sm flex items-center gap-2">
                    Nova ação
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showActionMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-dark-border rounded-xl shadow-xl z-50 overflow-hidden">
                      <button onClick={() => { setShowActionMenu(false); router.push('/admin/students'); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-text-primary">Adicionar Aluno</p>
                          <p className="text-xs text-text-secondary">Cadastrar novo aluno</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            }
          />

          <main className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                  <StatCard
                    key={i}
                    title={s.title}
                    value={s.value}
                    icon={<span>{s.icon}</span>}
                    trend={s.change}
                    gradient="bg-gradient-to-br from-primary to-primary-light text-white"
                  />
                ))}
              </div>

              {/* Funil de Conversão */}
              {funnelData && (
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <h2 className="text-base font-semibold text-text-primary">Funil de Conversão</h2>
                    <p className="text-sm text-text-secondary">Leads → Avaliações → Matrículas</p>
                  </CardHeader>
                  <CardBody>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-text-primary mb-2">{funnelData.leads}</div>
                        <div className="text-sm text-text-secondary mb-4">Leads</div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-text-primary mb-2">{funnelData.avaliacoes}</div>
                        <div className="text-sm text-text-secondary mb-4">Avaliações</div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${funnelData.leads > 0 ? (funnelData.avaliacoes / funnelData.leads) * 100 : 0}%` }}></div>
                        </div>
                        <div className="text-xs text-text-secondary mt-2">
                          {funnelData.leads > 0 ? ((funnelData.avaliacoes / funnelData.leads) * 100).toFixed(1) : 0}% conversão
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-text-primary mb-2">{funnelData.matriculas}</div>
                        <div className="text-sm text-text-secondary mb-4">Matrículas</div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${funnelData.leads > 0 ? (funnelData.matriculas / funnelData.leads) * 100 : 0}%` }}></div>
                        </div>
                        <div className="text-xs text-text-secondary mt-2">
                          Taxa: {funnelData.conversionRate}%
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* LTV, Churn e MRR */}
              {ltvChurnMrr && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <h2 className="text-base font-semibold text-text-primary">MRR</h2>
                      <p className="text-sm text-text-secondary">Monthly Recurring Revenue</p>
                    </CardHeader>
                    <CardBody>
                      <div className="text-3xl font-bold text-primary mb-2">
                        R$ {ltvChurnMrr.MRR.toFixed(2)}
                      </div>
                      <div className="text-sm text-text-secondary">Receita recorrente mensal</div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h2 className="text-base font-semibold text-text-primary">LTV</h2>
                      <p className="text-sm text-text-secondary">Lifetime Value</p>
                    </CardHeader>
                    <CardBody>
                      <div className="text-3xl font-bold text-primary mb-2">
                        R$ {ltvChurnMrr.LTV.toFixed(2)}
                      </div>
                      <div className="text-sm text-text-secondary">Valor médio por aluno</div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h2 className="text-base font-semibold text-text-primary">Churn Rate</h2>
                      <p className="text-sm text-text-secondary">Taxa de cancelamento</p>
                    </CardHeader>
                    <CardBody>
                      <div className="text-3xl font-bold text-red-500 mb-2">
                        {ltvChurnMrr.churnRate}%
                      </div>
                      <div className="text-sm text-text-secondary">
                        {ltvChurnMrr.churnedStudents} de {ltvChurnMrr.totalStudents} alunos
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold text-text-primary">Visão Geral</h2>
                        <p className="text-sm text-text-secondary">Estatísticas mensais</p>
                      </div>
                      <select className="px-3 py-2 rounded-lg border border-dark-border bg-white text-sm focus:outline-none focus:border-primary">
                        <option>Últimos 7 dias</option>
                        <option>Últimos 30 dias</option>
                        <option>Último ano</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="h-64 flex items-center justify-center text-text-secondary">
                      <p>Gráfico (placeholder)</p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-base font-semibold text-text-primary">Atividade Recente</h2>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      {[
                        { action: 'Novo aluno cadastrado', time: '5 min atrás', icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        ), color: 'text-accent-info' },
                        { action: 'Pagamento recebido', time: '15 min atrás', icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                        ), color: 'text-accent-success' },
                        { action: 'Aula agendada', time: '1 hora atrás', icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M5 11h14M5 19h14M5 11a2 2 0 012-2h10a2 2 0 012 2M5 19a2 2 0 002 2h10a2 2 0 002-2"/></svg>
                        ), color: 'text-primary' },
                        { action: 'Mensalidade vencida', time: '2 horas atrás', icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                        ), color: 'text-accent-warning' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 pb-4 border-b border-dark-border last:border-0 last:pb-0">
                          <span className={`text-2xl ${item.color}`}>{item.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm text-text-primary font-medium">{item.action}</p>
                            <p className="text-xs text-text-secondary mt-1">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-base font-semibold text-text-primary">Alunos em Destaque</h2>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      {[
                        { name: 'João Silva', progress: 95, status: 'Excelente' },
                        { name: 'Maria Santos', progress: 88, status: 'Ótimo' },
                        { name: 'Pedro Costa', progress: 76, status: 'Bom' },
                      ].map((student, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-text-primary">{student.name}</p>
                              <span className="text-xs text-text-secondary">{student.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full" style={{ width: `${student.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4-4 4 4m0 0V3m0 14H4"/></svg>
                      Aniversariantes
                    </h2>
                  </CardHeader>
                  <CardBody>
                    {(data?.aniversariantes || []).length > 0 ? (
                      <div className="space-y-3">
                        {data.aniversariantes.map((a: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-dark-border">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.104 0 2-.896 2-2s-2-3-2-3-2 1.896-2 3 0 2 2 2zm-7 8h14a2 2 0 002-2v-1a4 4 0 00-4-4H9a4 4 0 00-4 4v1a2 2 0 002 2zM5 20h14"/></svg>
                            </div>
                            <div>
                              <p className="text-text-primary font-medium">{a.name}</p>
                              <p className="text-xs text-text-secondary">Envie felicitações!</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-text-secondary">Nenhum aniversariante hoje</p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
