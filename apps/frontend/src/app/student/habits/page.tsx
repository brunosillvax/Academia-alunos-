'use client';
import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/ui/Sidebar';
import { Topbar } from '../../components/ui/Topbar';
import { Card, CardBody } from '../../components/ui/Card';
import { api } from '../../lib/api';
import { useRouter } from 'next/navigation';

interface Habit {
  id: string;
  name: string;
  description?: string;
  streak: number;
  longestStreak: number;
  active: boolean;
  checkedToday: boolean;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
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
      loadHabits();
    } catch {
      router.replace('/login');
    }
  };

  const loadHabits = async () => {
    try {
      const data = await api('/habits/student');
      setHabits(data);
    } catch (err) {
      console.error('Erro ao carregar hábitos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async (habitId: string) => {
    try {
      await api(`/habits/${habitId}/check`, { method: 'POST' });
      loadHabits();
    } catch (err) {
      console.error('Erro ao marcar hábito:', err);
    }
  };

  const handleCreate = async (name: string) => {
    try {
      await api('/habits', { method: 'POST', json: { name } });
      loadHabits();
    } catch (err) {
      console.error('Erro ao criar hábito:', err);
    }
  };

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const activeStreaks = habits.filter((h) => h.streak > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-card to-dark flex">
      <Sidebar active="habits" />
      <div className="flex-1 flex flex-col">
        <Topbar title="Hábitos e Check-ins" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardBody className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{totalStreak}</div>
                  <div className="text-sm text-text-secondary">Total de dias consecutivos</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{activeStreaks}</div>
                  <div className="text-sm text-text-secondary">Sequências ativas</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {habits.filter((h) => h.checkedToday).length}/{habits.length}
                  </div>
                  <div className="text-sm text-text-secondary">Hábitos hoje</div>
                </CardBody>
              </Card>
            </div>

            <div className="mb-6">
              <button
                onClick={() => {
                  const name = prompt('Nome do hábito:');
                  if (name) handleCreate(name);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
              >
                + Adicionar Hábito
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <Card key={habit.id}>
                  <CardBody>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-primary mb-1">{habit.name}</h3>
                        {habit.description && (
                          <p className="text-sm text-text-secondary mb-2">{habit.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-text-secondary">Sequência atual: </span>
                            <span className="font-bold text-primary">{habit.streak} 🔥</span>
                          </div>
                          <div>
                            <span className="text-text-secondary">Melhor: </span>
                            <span className="font-bold text-primary">{habit.longestStreak}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCheck(habit.id)}
                        disabled={habit.checkedToday}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          habit.checkedToday
                            ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                            : 'bg-primary text-white hover:opacity-90'
                        }`}
                      >
                        {habit.checkedToday ? '✓ Feito' : 'Marcar'}
                      </button>
                    </div>
                    {habit.streak >= 7 && (
                      <div className="mt-2 text-xs text-primary">
                        🏆 Conquista: 7 dias consecutivos!
                      </div>
                    )}
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
