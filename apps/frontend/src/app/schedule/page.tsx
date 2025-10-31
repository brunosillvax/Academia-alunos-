'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../components/ui/Sidebar';
import { Topbar } from '../components/ui/Topbar';
import { Card, CardBody } from '../components/ui/Card';
import { api } from '../lib/api';

interface Modality {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Schedule {
  id: string;
  modalityId: string;
  modality: Modality;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  instructor: string;
  maxCapacity: number;
  active: boolean;
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    modalityId: '',
    dayOfWeek: 0,
    startTime: '08:00',
    endTime: '09:00',
    instructor: '',
    maxCapacity: 20
  });
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
      loadData();
    } catch {
      router.replace('/login');
    }
  };

  const loadData = async () => {
    try {
      const [schedulesData, modalitiesData] = await Promise.all([
        api('/schedules'),
        api('/modalities'),
      ]);
      setSchedules(schedulesData);
      setModalities(modalitiesData.filter((m: any) => m.active));
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await api(`/schedules/${editingSchedule.id}`, { method: 'PUT', json: formData });
      } else {
        await api('/schedules', { method: 'POST', json: formData });
      }
      setShowModal(false);
      setEditingSchedule(null);
      setFormData({ modalityId: '', dayOfWeek: 0, startTime: '08:00', endTime: '09:00', instructor: '', maxCapacity: 20 });
      loadData();
    } catch (err) {
      console.error('Erro ao salvar horário:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este horário?')) return;
    try {
      await api(`/schedules/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error('Erro ao excluir horário:', err);
    }
  };

  const openModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        modalityId: schedule.modalityId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        instructor: schedule.instructor,
        maxCapacity: schedule.maxCapacity
      });
    } else {
      setEditingSchedule(null);
      setFormData({ modalityId: modalities[0]?.id || '', dayOfWeek: 1, startTime: '08:00', endTime: '09:00', instructor: '', maxCapacity: 20 });
    }
    setShowModal(true);
  };

  const getSchedulesByDay = (day: number) => schedules.filter(s => s.dayOfWeek === day && s.active);

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
        <Sidebar active="schedule" />
        <div className="flex-1 min-w-0">
          <Topbar
            title="Horários"
            subtitle="Gerencie a grade de horários"
            right={<button onClick={() => openModal()} className="btn-primary flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Novo Horário</button>}
          />

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Grade de Horários</h2>
                <p className="text-text-secondary">Organize e gerencie os horários das atividades</p>
              </div>

              {/* Schedule Grid */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {DAYS.map((day, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="rounded-2xl bg-white border border-dark-border p-4 mb-4 text-center shadow-sm">
                      <h3 className="font-bold text-text-primary">{day.substring(0, 3)}</h3>
                      <p className="text-xs text-text-secondary mt-1">{day}</p>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      {getSchedulesByDay(index).length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-dark-border bg-white p-6 text-center h-full flex items-center justify-center">
                          <p className="text-text-secondary text-sm">Sem aulas</p>
                        </div>
                      ) : (
                        getSchedulesByDay(index).map((schedule) => (
                          <div 
                            key={schedule.id} 
                            className="rounded-2xl border border-dark-border bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                          >
                            {/* Color indicator bar */}
                            <div 
                              className="absolute left-0 top-0 bottom-0 w-1" 
                              style={{ backgroundColor: schedule.modality.color }}
                            ></div>
                            
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                                  style={{ backgroundColor: `${schedule.modality.color}20`, color: schedule.modality.color }}
                                >
                                  {schedule.modality.icon}
                                </div>
                                <div>
                                  <h4 className="font-bold text-text-primary text-sm">{schedule.modality.name}</h4>
                                  <p className="text-xs text-text-secondary">{schedule.instructor}</p>
                                </div>
                              </div>
                              
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); openModal(schedule); }} 
                                  className="p-1.5 hover:bg-gray-100 rounded-lg text-text-secondary hover:text-text-primary"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDelete(schedule.id); }} 
                                  className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-text-primary">{schedule.startTime} - {schedule.endTime}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-sm text-text-secondary">{schedule.maxCapacity}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Empty State */}
              {schedules.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-1">Nenhum horário cadastrado</h3>
                  <p className="text-text-secondary mb-6">Comece criando sua primeira aula na grade de horários</p>
                  <button 
                    onClick={() => openModal()} 
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar Horário
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
                    <h2 className="text-2xl font-bold text-text-primary">{editingSchedule ? 'Editar Horário' : 'Novo Horário'}</h2>
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
                      <label className="block text-sm font-medium text-text-secondary mb-2">Modalidade</label>
                      <select 
                        value={formData.modalityId} 
                        onChange={(e) => setFormData({ ...formData, modalityId: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                        required
                      >
                        <option value="">Selecione uma modalidade</option>
                        {modalities.map((m) => (
                          <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Dia da Semana</label>
                      <select 
                        value={formData.dayOfWeek} 
                        onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })} 
                        className="w-full px-4 py-3 rounded-xl border border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                        required
                      >
                        {DAYS.map((day, index) => (
                          <option key={index} value={index}>{day}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Horário Início</label>
                        <input 
                          type="time" 
                          value={formData.startTime} 
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} 
                          className="w-full px-4 py-3 rounded-xl border border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Horário Fim</label>
                        <input 
                          type="time" 
                          value={formData.endTime} 
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} 
                          className="w-full px-4 py-3 rounded-xl border border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Instrutor</label>
                      <input 
                        type="text" 
                        value={formData.instructor} 
                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                        placeholder="Nome do instrutor" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Capacidade Máxima</label>
                      <input 
                        type="number" 
                        value={formData.maxCapacity} 
                        onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })} 
                        className="w-full px-4 py-3 rounded-xl border border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                        min="1" 
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