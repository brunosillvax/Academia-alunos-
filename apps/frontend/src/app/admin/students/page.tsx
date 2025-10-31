'use client';
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/ui/Sidebar';
import { Topbar } from '../../components/ui/Topbar';
import { Card, CardBody, CardHeader, StatCard } from '../../components/ui/Card';
import { api } from '../../lib/api';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    initialWeight: '',
    height: '',
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const me = await api('/auth/me');
      const user = me?.user;
      if (!user) return router.replace('/login');
      if (user.role !== 'ADMIN') return router.replace('/student');
      await loadStudents();
    } catch {
      router.replace('/login');
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api('/admin/students');
      setStudents(res.students || []);
    } catch (err) {
      console.error('Erro ao carregar alunos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/admin/students', {
        method: 'POST',
        json: {
          ...formData,
          initialWeight: parseFloat(formData.initialWeight),
          height: parseFloat(formData.height),
        },
      });
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', birthDate: '', initialWeight: '', height: '' });
      loadStudents();
    } catch (err) {
      console.error('Erro ao adicionar aluno:', err);
    }
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

  const stats = [
    { title: 'Total de Alunos', value: students.length, icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { title: 'Ativos', value: students.filter(s => s.profile).length, icon: '✅', color: 'from-green-500 to-emerald-500' },
    { title: 'Novos (30d)', value: students.filter(s => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return new Date(s.createdAt) > d;
    }).length, icon: '📅', color: 'from-purple-500 to-pink-500' },
    { title: 'Taxa de Presença', value: '87.5%', icon: '📊', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar active="students" />
        <div className="flex-1 min-w-0">
          <Topbar
            title="Gerenciar Alunos"
            subtitle="Visualize e gerencie alunos cadastrados"
            right={
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Aluno
              </button>
            }
          />

          <main className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                  <StatCard key={i} title={s.title} value={s.value} icon={<span>{s.icon}</span>} trend={undefined} gradient="bg-gradient-to-br from-primary to-primary-light text-white" />
                ))}
              </div>

              {showAddForm && (
                <Card>
                  <CardHeader>
                    <h2 className="text-base font-semibold text-text-primary">Adicionar Novo Aluno</h2>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={handleAddStudent} className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Nome Completo</label>
                        <input className="input-modern" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">E-mail</label>
                        <input type="email" className="input-modern" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Senha</label>
                        <input type="password" className="input-modern" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Data de Nascimento</label>
                        <input type="date" className="input-modern" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Peso Inicial (kg)</label>
                        <input type="number" step="0.1" className="input-modern" value={formData.initialWeight} onChange={(e) => setFormData({ ...formData, initialWeight: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Altura (m)</label>
                        <input type="number" step="0.01" className="input-modern" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} required />
                      </div>
                      <div className="md:col-span-2 flex gap-4">
                        <button type="submit" className="btn-primary flex-1">Cadastrar Aluno</button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">Cancelar</button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <h2 className="text-base font-semibold text-text-primary">Lista de Alunos</h2>
                </CardHeader>
                <CardBody>
                  {students.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-dark-border">
                            <th className="table-header text-left p-4">Aluno</th>
                            <th className="table-header text-left p-4">E-mail</th>
                            <th className="table-header text-left p-4">Data Cadastro</th>
                            <th className="table-header text-left p-4">Status</th>
                            <th className="table-header text-right p-4">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id} className="table-row">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold">
                                    {student.name.charAt(0)}
                                  </div>
                                  <span className="text-text-primary font-medium">{student.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-text-secondary">{student.email}</td>
                              <td className="p-4 text-text-secondary">{new Date(student.createdAt).toLocaleDateString('pt-BR')}</td>
                              <td className="p-4"><span className="badge badge-success">Ativo</span></td>
                              <td className="p-4 text-right">
                                <button onClick={() => router.push(`/admin/students/${student.id}`)} className="text-primary hover:text-primary-light text-sm font-medium">
                                  Ver Detalhes →
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">👥</div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">Nenhum Aluno Cadastrado</h3>
                      <p className="text-text-secondary mb-6">Comece adicionando seu primeiro aluno!</p>
                      <button onClick={() => setShowAddForm(true)} className="btn-primary">Adicionar Primeiro Aluno</button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
