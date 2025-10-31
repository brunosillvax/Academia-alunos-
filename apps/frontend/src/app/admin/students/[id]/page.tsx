'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function StudentDetailPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [progressModal, setProgressModal] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    notes: ''
  });
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      checkAuthAndLoad();
    }
  }, [id]);

  const checkAuthAndLoad = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/auth/me`, { credentials: 'include' });
      if (!res.ok) {
        router.replace('/login');
        return;
      }
      const user = await res.json();
      if (user.role !== 'ADMIN') {
        router.replace('/student');
        return;
      }
      loadStudent();
    } catch (err) {
      router.replace('/login');
    }
  };

  const loadStudent = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/admin/students/${id}`, { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        router.push('/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
      }
    } catch (err) {
      console.error('Erro ao carregar aluno:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-dark">
        <aside className="w-64 bg-dark-sidebar border-r border-dark-border"></aside>
        <div className="flex-1 flex items-center justify-center">
          <div className="card-float p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-screen bg-dark items-center justify-center">
        <div className="card-float p-8 text-center">
          <p className="text-text-secondary">Aluno não encontrado</p>
          <button onClick={() => router.push('/admin/students')} className="btn-primary mt-4">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const profile = student.profile || {};
  const progressEntries = profile.progressEntries || [];
  const payments = student.payments || [];

  const calculateIMC = () => {
    if (!profile.currentWeight || !profile.height) return '-';
    const imc = profile.currentWeight / (profile.height * profile.height);
    return imc.toFixed(1);
  };

  const getIMCStatus = (imc: number) => {
    if (imc < 18.5) return { text: 'Abaixo do peso', color: 'text-accent-warning' };
    if (imc < 25) return { text: 'Peso normal', color: 'text-accent-success' };
    if (imc < 30) return { text: 'Sobrepeso', color: 'text-accent-warning' };
    return { text: 'Obesidade', color: 'text-accent-danger' };
  };

  const imc = parseFloat(calculateIMC());
  const imcStatus = getIMCStatus(imc);

  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/admin/students/${id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          weight: parseFloat(formData.weight),
          notes: formData.notes || null
        })
      });
      if (res.ok) {
        setProgressModal(false);
        setFormData({ weight: '', notes: '' });
        loadStudent(); // Recarrega dados
      }
    } catch (err) {
      console.error('Erro ao adicionar evolução:', err);
    }
  };

  return (
    <div className="flex h-screen bg-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-sidebar border-r border-dark-border flex flex-col">
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-text-primary">GymFlow</h2>
              <p className="text-xs text-text-secondary">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <a href="/admin" className="sidebar-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="/admin/students" className="sidebar-link active">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Alunos</span>
          </a>
          <a href="/modalities" className="sidebar-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Modalidades</span>
          </a>
          <a href="/plans" className="sidebar-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Planos</span>
          </a>
          <a href="/schedule" className="sidebar-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Horários</span>
          </a>
        </nav>

        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Admin</p>
              <p className="text-xs text-text-secondary">admin@gymflow.local</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-dark-sidebar/80 backdrop-blur border-b border-dark-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/admin/students')} className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-text-primary">{student.name}</h1>
              <p className="text-sm text-text-secondary">{student.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditModal(true)} className="btn-secondary">Editar</button>
            <button onClick={() => setProgressModal(true)} className="btn-primary">Adicionar Evolução</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Informações Pessoais */}
            <div className="card-float p-6">
              <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informações Pessoais
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Data de Nascimento</p>
                  <p className="text-text-primary font-medium">
                    {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Altura</p>
                  <p className="text-text-primary font-medium">{profile.height ? `${profile.height}m` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">IMC</p>
                  <p className={`font-bold ${imcStatus.color}`}>
                    {calculateIMC()} {imc > 0 && `(${imcStatus.text})`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Peso Inicial</p>
                  <p className="text-text-primary font-medium">{profile.initialWeight ? `${profile.initialWeight}kg` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Peso Atual</p>
                  <p className="text-text-primary font-medium">{profile.currentWeight ? `${profile.currentWeight}kg` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Evolução</p>
                  <p className={`font-bold ${(profile.currentWeight - profile.initialWeight) < 0 ? 'text-accent-success' : 'text-accent-warning'}`}>
                    {profile.currentWeight && profile.initialWeight 
                      ? `${(profile.currentWeight - profile.initialWeight) > 0 ? '+' : ''}${(profile.currentWeight - profile.initialWeight).toFixed(1)}kg`
                      : '-'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Progresso */}
            <div className="card-float p-6">
              <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Histórico de Evolução
              </h2>
              {progressEntries.length > 0 ? (
                <div className="space-y-4">
                  {progressEntries.map((entry: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-dark-border/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-text-primary">
                            {new Date(entry.date).toLocaleDateString('pt-BR')}
                          </p>
                          <span className="badge badge-info">{entry.weight}kg</span>
                        </div>
                        {entry.notes && (
                          <p className="text-xs text-text-secondary">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-text-secondary">Nenhuma evolução registrada ainda</p>
                </div>
              )}
            </div>

            {/* Pagamentos */}
            <div className="card-float p-6">
              <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Histórico de Pagamentos
              </h2>
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="table-header text-left p-4">Data</th>
                        <th className="table-header text-left p-4">Valor</th>
                        <th className="table-header text-left p-4">Status</th>
                        <th className="table-header text-left p-4">Vencimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment: any) => (
                        <tr key={payment.id} className="table-row">
                          <td className="p-4 text-text-primary">
                            {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-4 text-text-primary font-medium">
                            R$ {(payment.amount / 100).toFixed(2)}
                          </td>
                          <td className="p-4">
                            <span className={`badge ${
                              payment.status === 'PAID' ? 'badge-success' : 
                              payment.status === 'PENDING' ? 'badge-warning' : 'badge-danger'
                            }`}>
                              {payment.status === 'PAID' ? 'Pago' : 
                               payment.status === 'PENDING' ? 'Pendente' : 'Vencido'}
                            </span>
                          </td>
                          <td className="p-4 text-text-secondary">
                            {payment.expiresAt ? new Date(payment.expiresAt).toLocaleDateString('pt-BR') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💳</div>
                  <p className="text-text-secondary">Nenhum pagamento registrado</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Adicionar Evolução */}
      {progressModal && (
        <div onClick={() => setProgressModal(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div onClick={(e) => e.stopPropagation()} className="card-float max-w-md w-full p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Adicionar Evolução</h2>
              <button onClick={() => setProgressModal(false)} className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
                <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddProgress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Peso Atual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="input-field"
                  placeholder="Ex: 75.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Observações (opcional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Ex: Ganho de massa muscular, boa evolução..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Salvar Evolução
                </button>
                <button type="button" onClick={() => setProgressModal(false)} className="px-6 btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Editar (placeholder) */}
      {editModal && (
        <div onClick={() => setEditModal(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div onClick={(e) => e.stopPropagation()} className="card-float max-w-md w-full p-8 animate-slide-up text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">Funcionalidade em Desenvolvimento</h2>
            <p className="text-text-secondary mb-6">
              A edição de dados do aluno será implementada em breve.
            </p>
            <button onClick={() => setEditModal(false)} className="btn-primary">
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
