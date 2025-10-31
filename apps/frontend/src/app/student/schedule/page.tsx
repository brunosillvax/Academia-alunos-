'use client';
import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/ui/Sidebar';
import { Topbar } from '../../components/ui/Topbar';
import { Card, CardBody } from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../lib/api';
import { useRouter } from 'next/navigation';

interface Schedule {
  id: string;
  modality: { name: string; color: string; icon: string };
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  instructor: string;
  maxCapacity: number;
  enrolledCount?: number;
  isEnrolled?: boolean;
  waitlistPosition?: number;
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function StudentSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const me = await api('/auth/me');
      if (!me?.user || me.user.role !== 'STUDENT') {
        router.replace('/login');
        return;
      }
      loadSchedules();
    } catch {
      router.replace('/login');
    }
  };

  const loadSchedules = async () => {
    try {
      const data = await api('/schedules/student');
      setSchedules(data);
    } catch (err) {
      console.error('Erro ao carregar horários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (scheduleId: string, date: string) => {
    try {
      await api(`/schedules/${scheduleId}/enroll`, {
        method: 'POST',
        json: { date },
      });
      loadSchedules();
    } catch (err: any) {
      alert(err.message || 'Erro ao inscrever-se');
    }
  };

  const handleWaitlist = async (scheduleId: string) => {
    try {
      await api(`/schedules/${scheduleId}/waitlist`, { method: 'POST' });
      loadSchedules();
    } catch (err: any) {
      alert(err.message || 'Erro ao entrar na lista de espera');
    }
  };

  const getSchedulesByDay = (day: number) =>
    schedules.filter((s) => s.dayOfWeek === day);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-card to-dark flex">
        <Sidebar active="schedule" />
        <div className="flex-1 flex flex-col">
          <Topbar title="Agenda de Aulas" />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardBody>
                      <Skeleton className="h-6 w-32 mb-4" />
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="p-4 rounded-xl border border-dark-border">
                            <Skeleton className="h-5 w-24 mb-2" />
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-4 w-40 mb-3" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-card to-dark flex">
      <Sidebar active="schedule" />
      <div className="flex-1 flex flex-col">
        <Topbar title="Agenda de Aulas" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-text-primary">Horários Disponíveis</h1>
              <div className="flex items-center gap-4">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/calendar/export-ics`}
                  target="_blank"
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Exportar para Google Calendar
                </a>
                <div className="text-sm text-text-secondary">
                  <span className="inline-block w-3 h-3 rounded-full bg-primary mr-1"></span>
                  Disponível
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-4 mr-1"></span>
                  Lotado
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {DAYS.map((day, dayIndex) => {
                const daySchedules = getSchedulesByDay(dayIndex);
                if (daySchedules.length === 0) return null;

                return (
                  <Card key={dayIndex}>
                    <CardBody>
                      <h2 className="text-xl font-bold text-text-primary mb-4">{day}</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {daySchedules.map((schedule) => {
                          const isFull = (schedule.enrolledCount || 0) >= schedule.maxCapacity;
                          const spotsLeft = schedule.maxCapacity - (schedule.enrolledCount || 0);

                          return (
                            <div
                              key={schedule.id}
                              className={`p-4 rounded-xl border ${
                                isFull ? 'border-red-500/50 bg-red-500/5' : 'border-dark-border bg-dark-card'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className="px-2 py-1 rounded text-xs font-semibold"
                                  style={{ backgroundColor: schedule.modality.color + '20', color: schedule.modality.color }}
                                >
                                  {schedule.modality.icon} {schedule.modality.name}
                                </span>
                                {!isFull && (
                                  <span className="text-xs text-text-secondary">{spotsLeft} vaga{spotsLeft !== 1 ? 's' : ''}</span>
                                )}
                              </div>
                              <div className="text-sm text-text-secondary mb-2">
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                              <div className="text-sm text-text-secondary mb-3">
                                Prof. {schedule.instructor}
                              </div>
                              {schedule.isEnrolled ? (
                                <button className="w-full px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                                  ✓ Inscrito
                                </button>
                              ) : schedule.waitlistPosition ? (
                                <div className="text-center">
                                  <div className="text-xs text-text-secondary mb-1">
                                    Lista de espera: posição {schedule.waitlistPosition}
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    const today = new Date();
                                    const nextDay = new Date(today);
                                    nextDay.setDate(today.getDate() + (dayIndex - today.getDay() + 7) % 7);
                                    handleEnroll(schedule.id, nextDay.toISOString());
                                  }}
                                  disabled={isFull}
                                  className={`w-full px-3 py-2 rounded-lg text-sm font-semibold ${
                                    isFull
                                      ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                                      : 'bg-primary text-white hover:opacity-90'
                                  }`}
                                >
                                  {isFull ? 'Lotado - Entrar na lista' : 'Inscrever-se'}
                                </button>
                              )}
                              {isFull && !schedule.isEnrolled && !schedule.waitlistPosition && (
                                <button
                                  onClick={() => handleWaitlist(schedule.id)}
                                  className="w-full mt-2 px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm font-semibold hover:bg-primary/30"
                                >
                                  Lista de Espera
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
