'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    height: '',
    initialWeight: ''
  });
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/auth/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        console.log('Dados do usuário /student:', data);
        // Extrai o usuário corretamente (pode vir como {user: ...} ou direto)
        const userData = data.user || data;
        console.log('Role do usuário:', userData.role);
        setUser(userData);
      } else {
        console.log('Não autenticado');
      }
    } catch (err) {
      console.error('Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/admin/students`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          birthDate: formData.birthDate,
          height: parseFloat(formData.height),
          initialWeight: parseFloat(formData.initialWeight),
        }),
      });
      if (res.ok) {
        setShowAddUserModal(false);
        setFormData({ name: '', email: '', password: '', birthDate: '', height: '', initialWeight: '' });
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      } else {
        const error = await res.json();
        alert('❌ Erro ao cadastrar: ' + (error.message || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error('Erro ao cadastrar aluno:', err);
      alert('❌ Erro ao cadastrar aluno');
    }
  };

  const handleLogout = () => {
    const cookieName = (process.env.NEXT_PUBLIC_COOKIE_NAME as string) || 'gf_token';
    document.cookie = `${cookieName}=; Max-Age=0; path=/`;
    window.location.href = '/';
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

  if (!user) {
    return null;
  }

  const profile = user.profile || {};

  // Se for ADMIN visualizando, mostra dados de exemplo
  const isAdmin = user.role === 'ADMIN';
  const displayProfile = isAdmin ? {
    currentWeight: 75,
    initialWeight: 80,
    height: 1.75,
    birthDate: new Date('1990-01-01')
  } : profile;

  const calculateIMC = () => {
    if (!displayProfile.currentWeight || !displayProfile.height) return '-';
    const imc = displayProfile.currentWeight / (displayProfile.height * displayProfile.height);
    return imc.toFixed(1);
  };

  const imc = parseFloat(calculateIMC());
  const getIMCStatus = () => {
    if (imc < 18.5) return { text: 'Abaixo do peso', color: 'text-accent-warning' };
    if (imc < 25) return { text: 'Peso normal', color: 'text-accent-success' };
    if (imc < 30) return { text: 'Sobrepeso', color: 'text-accent-warning' };
    return { text: 'Obesidade', color: 'text-accent-danger' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="h-16 bg-white/90 backdrop-blur border-b border-dark-border sticky top-0 z-40">
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
            <a href="/student" className="text-primary font-semibold text-sm">Meu Perfil</a>
            <a href="/student/evolution" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">Evolução</a>
            <a href="/student/payments" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">Pagamentos</a>
            <button onClick={handleLogout} className="btn-secondary text-sm">Sair</button>
          </nav>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Olá, {user.name || 'Usuário'}!
                  {user.role === 'ADMIN' && <span className="text-sm text-primary ml-3">(Visualização Admin)</span>}
                </h1>
                <p className="text-text-secondary">
                  {user.role === 'ADMIN' ? 'Você está visualizando a área do aluno' : 'Bem-vindo à sua área pessoal'}
                </p>
              </div>
            </div>
            {user.role === 'ADMIN' && (
              <button onClick={() => setShowAddUserModal(true)} className="btn-primary flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Cadastrar Aluno
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                  ⚖️
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Peso Atual</p>
                  <p className="text-2xl font-bold text-text-primary">{displayProfile.currentWeight || '-'}kg</p>
                </div>
              </div>
            </div>

            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <p className="text-sm text-text-secondary">IMC</p>
                  <p className={`text-2xl font-bold ${imc > 0 ? getIMCStatus().color : 'text-text-primary'}`}>
                    {calculateIMC()}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                  📈
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Evolução</p>
                  <p className={`text-2xl font-bold ${(displayProfile.currentWeight - displayProfile.initialWeight) < 0 ? 'text-accent-success' : 'text-accent-warning'}`}>
                    {displayProfile.currentWeight && displayProfile.initialWeight
                      ? `${(displayProfile.currentWeight - displayProfile.initialWeight) > 0 ? '+' : ''}${(displayProfile.currentWeight - displayProfile.initialWeight).toFixed(1)}kg`
                      : '-'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Meta</p>
                  <p className="text-2xl font-bold text-text-primary">{isAdmin ? 'Visualização' : (displayProfile.goal || 'Não definida')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="card-float p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informações Pessoais
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-text-secondary mb-1">Email</p>
                <p className="text-text-primary font-medium">{user.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Data de Nascimento</p>
                <p className="text-text-primary font-medium">
                  {displayProfile.birthDate ? new Date(displayProfile.birthDate).toLocaleDateString('pt-BR') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Altura</p>
                <p className="text-text-primary font-medium">{displayProfile.height ? `${displayProfile.height}m` : '-'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <a href="/student/evolution" className="card-float p-6 hover:shadow-glow transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  📈
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-1">Acompanhar Evolução</h3>
                  <p className="text-sm text-text-secondary">Veja seu progresso e histórico de peso</p>
                </div>
                <svg className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            <a href="/student/payments" className="card-float p-6 hover:shadow-glow transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  💳
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-1">Meus Pagamentos</h3>
                  <p className="text-sm text-text-secondary">Visualize seu histórico de mensalidades</p>
                </div>
                <svg className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* Modal Cadastrar Aluno */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-float p-8 max-w-2xl w-full animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Cadastrar Novo Aluno
              </h2>
              <button onClick={() => setShowAddUserModal(false)} className="text-text-secondary hover:text-text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    placeholder="Ex: joao@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Altura (m) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    placeholder="Ex: 1.75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Peso Inicial (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.initialWeight}
                    onChange={(e) => setFormData({ ...formData, initialWeight: e.target.value })}
                    className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    placeholder="Ex: 80.5"
                  />
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-6">
                <p className="text-sm text-text-secondary">
                  💡 <strong className="text-text-primary">Dica:</strong> O aluno poderá fazer login com o email e senha cadastrados aqui.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="flex-1 btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Cadastrar Aluno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast de Sucesso */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className="card-float p-4 pr-6 flex items-center gap-4 shadow-glow border-l-4 border-accent-success">
            <div className="w-12 h-12 bg-accent-success/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-text-primary mb-1">✅ Sucesso!</h4>
              <p className="text-sm text-text-secondary">Aluno cadastrado com sucesso</p>
            </div>
            <button onClick={() => setShowSuccessToast(false)} className="ml-4 text-text-secondary hover:text-text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
