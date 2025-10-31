'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '../../components/ui/Topbar';
import { Card, CardBody } from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';

export default function EvolutionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
  });
  const router = useRouter();

  useEffect(() => {
    loadEvolution();
  }, []);

  const loadEvolution = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/student/evolution`, { credentials: 'include' });
      if (res.ok) {
        const evolutionData = await res.json();
        setData(evolutionData);
      } else {
        console.error('Erro ao carregar evolução');
      }
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/student/progress`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: parseFloat(formData.weight),
          bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
          measurements: {
            chest: formData.chest ? parseFloat(formData.chest) : undefined,
            waist: formData.waist ? parseFloat(formData.waist) : undefined,
            hips: formData.hips ? parseFloat(formData.hips) : undefined,
            arms: formData.arms ? parseFloat(formData.arms) : undefined,
            thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
          },
        }),
      });
      if (res.ok) {
        setShowAddForm(false);
        setFormData({ weight: '', bodyFat: '', chest: '', waist: '', hips: '', arms: '', thighs: '' });
        loadEvolution();
      }
    } catch (err) {
      console.error('Erro ao adicionar progresso:', err);
    }
  };

  const handleLogout = () => {
    const cookieName = (process.env.NEXT_PUBLIC_COOKIE_NAME as string) || 'gf_token';
    document.cookie = `${cookieName}=; Max-Age=0; path=/`;
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-card to-dark">
        <Topbar
          title="Minha Evolução"
          subtitle="Acompanhe seu progresso ao longo do tempo"
        />
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-10 w-48 mb-6" />
            <Card>
              <CardBody>
                <Skeleton className="h-6 w-40 mb-6" />
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="aspect-[3/4] w-full" />
                  ))}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-64 w-full" />
              </CardBody>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const chartData = data?.entries?.map((e: any) => ({
    date: new Date(e.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    weight: e.weight,
    bodyFat: e.bodyFat || null,
  })).reverse() || [];

  const stats = data?.stats || {};
  const weightChange = stats.weightChange || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        title="Minha Evolução"
        subtitle="Acompanhe seu progresso ao longo do tempo"
        right={(
          <div className="flex items-center gap-3">
            <a href="/student" className="text-sm text-text-secondary hover:text-text-primary">Meu Perfil</a>
            <a href="/student/evolution" className="text-sm text-primary font-medium">Evolução</a>
            <a href="/student/payments" className="text-sm text-text-secondary hover:text-text-primary">Pagamentos</a>
            <button onClick={handleLogout} className="btn-secondary text-sm">Sair</button>
          </div>
        )}
      />

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div />
            <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Registro
            </button>
          </div>

          {/* Photos Section */}
          <div className="card-float p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">Fotos de Evolução</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {['front', 'side', 'back'].map((angle) => {
                const photo = data?.photos?.find((p: any) => p.angle === angle);
                return (
                  <div key={angle} className="text-center">
                    <div className="aspect-[3/4] bg-dark-hover rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                      {photo ? (
                        <img src={photo.url} alt={angle} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-text-secondary">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">{angle === 'front' ? 'Frente' : angle === 'side' ? 'Lado' : 'Costas'}</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = async (ev) => {
                            const url = ev.target?.result as string;
                            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                            await fetch(`${api}/student/evolution/photos`, {
                              method: 'POST',
                              credentials: 'include',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ angle, url }),
                            });
                            loadEvolution();
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id={`photo-${angle}`}
                    />
                    <label
                      htmlFor={`photo-${angle}`}
                      className="cursor-pointer text-sm text-primary hover:underline"
                    >
                      {photo ? 'Trocar foto' : 'Adicionar foto'}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                  🏋️
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Peso Inicial</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.initialWeight || '-'}kg</p>
                </div>
              </div>
            </div>

            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                  ⚖️
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Peso Atual</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.currentWeight || '-'}kg</p>
                </div>
              </div>
            </div>

            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Variação</p>
                  <p className={`text-2xl font-bold ${weightChange < 0 ? 'text-accent-success' : weightChange > 0 ? 'text-accent-warning' : 'text-text-primary'}`}>
                    {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}kg
                  </p>
                </div>
              </div>
            </div>

            <div className="card-float p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                  📝
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Registros</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.totalEntries || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="card-float p-8">
            <h2 className="text-xl font-bold text-text-primary mb-6">Gráfico de Evolução</h2>
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2E3139" />
                    <XAxis dataKey="date" stroke="#B4B7C0" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#B4B7C0" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(26, 29, 41, 0.95)',
                        border: '1px solid #2E3139',
                        color: '#F7F7F8',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                      }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#6C5DD3" strokeWidth={3} dot={{ fill: '#6C5DD3', r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Nenhum Registro Ainda</h3>
                <p className="text-text-secondary mb-6">Comece a registrar seu progresso para ver gráficos incríveis!</p>
                <button onClick={() => setShowAddForm(true)} className="btn-primary">
                  Adicionar Primeiro Registro
                </button>
              </div>
            )}
          </div>

          {/* Histórico */}
          {data?.entries && data.entries.length > 0 && (
            <div className="card-float p-6">
              <h2 className="text-xl font-bold text-text-primary mb-6">Histórico de Registros</h2>
              <div className="space-y-3">
                {data.entries.slice(0, 10).map((entry: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-dark-hover rounded-lg hover:bg-dark-border/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-text-primary font-medium">{new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        <p className="text-sm text-text-secondary">{entry.weight}kg{entry.bodyFat ? ` • ${entry.bodyFat}% BF` : ''}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Adicionar Registro */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-float p-8 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Novo Registro</h2>
              <button onClick={() => setShowAddForm(false)} className="text-text-secondary hover:text-text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddProgress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Peso (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                  placeholder="Ex: 75.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Percentual de Gordura (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bodyFat}
                  onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                  placeholder="Ex: 18.5"
                />
              </div>
              <div className="border-t border-dark-border pt-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Medidas (cm) - Opcional</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Peito</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.chest}
                      onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                      className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm"
                      placeholder="Ex: 95"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Cintura</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm"
                      placeholder="Ex: 80"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Quadril</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.hips}
                      onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                      className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm"
                      placeholder="Ex: 95"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Braços</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.arms}
                      onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                      className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm"
                      placeholder="Ex: 35"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-text-secondary mb-1">Coxas</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.thighs}
                      onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                      className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm"
                      placeholder="Ex: 55"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
