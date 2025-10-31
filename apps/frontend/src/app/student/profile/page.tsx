'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentProfilePage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${api}/student/profile`, { credentials: 'include' as any })
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          router.push('/login');
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-float p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-float p-8 text-center">
          <p className="text-slate-600">Sem dados disponíveis</p>
        </div>
      </div>
    );
  }

  const profile = data?.profile;

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-glow">
              {data?.name?.charAt(0) || 'U'}
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Meu Perfil</h1>
          <p className="text-text-secondary">Suas informações pessoais e progresso</p>
        </div>

        {/* Profile Card */}
        <div className="card-float p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
            <span>👤</span> Informações Pessoais
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/10 rounded-xl p-5">
              <p className="text-sm text-text-secondary mb-1">Nome Completo</p>
              <p className="text-lg font-semibold text-text-primary">{data?.name || '-'}</p>
            </div>
            <div className="bg-accent-info/10 rounded-xl p-5">
              <p className="text-sm text-text-secondary mb-1">E-mail</p>
              <p className="text-lg font-semibold text-text-primary">{data?.email || '-'}</p>
            </div>
            <div className="bg-accent-success/10 rounded-xl p-5">
              <p className="text-sm text-text-secondary mb-1">Altura</p>
              <p className="text-lg font-semibold text-text-primary">{profile?.height ? `${profile.height} m` : '-'}</p>
            </div>
            <div className="bg-accent-warning/10 rounded-xl p-5">
              <p className="text-sm text-text-secondary mb-1">Peso Atual</p>
              <p className="text-lg font-semibold text-text-primary">{profile?.currentWeight ? `${profile.currentWeight} kg` : '-'}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-float p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-2xl mb-3">
              💪
            </div>
            <p className="text-sm text-text-secondary mb-1">Treinos este Mês</p>
            <p className="text-2xl font-bold text-text-primary">12</p>
          </div>
          <div className="card-float p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl mb-3">
              🎯
            </div>
            <p className="text-sm text-text-secondary mb-1">Meta Semanal</p>
            <p className="text-2xl font-bold text-text-primary">75%</p>
          </div>
          <div className="card-float p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-2xl mb-3">
              🔥
            </div>
            <p className="text-sm text-text-secondary mb-1">Sequência</p>
            <p className="text-2xl font-bold text-text-primary">5 dias</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <a href="/student/evolution" className="card-float p-6 group hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📈
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Evolução</h3>
                <p className="text-sm text-text-secondary">Acompanhe seu progresso</p>
              </div>
            </div>
          </a>
          <a href="/student/payments" className="card-float p-6 group hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-success to-accent-success rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                💳
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Pagamentos</h3>
                <p className="text-sm text-text-secondary">Histórico financeiro</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}
