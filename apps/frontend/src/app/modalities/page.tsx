'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Modality {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  active: boolean;
  _count?: { schedules: number };
}

export default function ModalitiesPage() {
  const [loading, setLoading] = useState(true);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingModality, setEditingModality] = useState<Modality | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '🏋️', color: '#6C5DD3' });
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/auth/me`, { credentials: 'include' });
      if (!res.ok) {
        router.replace('/login');
        return;
      }
      const user = await res.json();
      const userData = user.user || user;
      if (userData.role !== 'ADMIN') {
        router.replace('/student');
        return;
      }
      setLoading(false);
      loadModalities();
    } catch (err) {
      router.replace('/login');
    }
  };

  const loadModalities = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${api}/modalities`);
      const data = await res.json();
      setModalities(data);
    } catch (err) {
      console.error('Erro ao carregar modalidades:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      if (editingModality) {
        await fetch(`${api}/modalities/${editingModality.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(`${api}/modalities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
      }
      setShowModal(false);
      setEditingModality(null);
      setFormData({ name: '', description: '', icon: '🏋️', color: '#6C5DD3' });
      loadModalities();
    } catch (err) {
      console.error('Erro ao salvar modalidade:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta modalidade?')) return;
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      await fetch(`${api}/modalities/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      loadModalities();
    } catch (err) {
      console.error('Erro ao excluir modalidade:', err);
    }
  };

  const openModal = (modality?: Modality) => {
    if (modality) {
      setEditingModality(modality);
      setFormData({ name: modality.name, description: modality.description, icon: modality.icon, color: modality.color });
    } else {
      setEditingModality(null);
      setFormData({ name: '', description: '', icon: '🏋️', color: '#6C5DD3' });
    }
    setShowModal(true);
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
          <a href="/admin/students" className="sidebar-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Alunos</span>
          </a>
          <a href="/modalities" className="sidebar-link active">
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
          <div>
            <h1 className="text-xl font-bold text-text-primary">Modalidades</h1>
            <p className="text-sm text-text-secondary">Gerencie as modalidades da academia</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Modalidade
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modalities.map((modality) => (
                <div key={modality.id} className="card-float p-6 hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl" style={{ color: modality.color }}>{modality.icon}</div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(modality)} className="p-2 hover:bg-dark-sidebar rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(modality.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">{modality.name}</h3>
                  <p className="text-text-secondary text-sm mb-4">{modality.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">{modality._count?.schedules || 0} horários</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${modality.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                      {modality.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="card-float p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-text-primary mb-6">{editingModality ? 'Editar Modalidade' : 'Nova Modalidade'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Nome</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Descrição</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Ícone (Emoji)</label>
                    <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="input-field text-2xl" maxLength={2} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Cor</label>
                    <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="input-field h-11" required />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button type="submit" className="btn-primary flex-1">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
