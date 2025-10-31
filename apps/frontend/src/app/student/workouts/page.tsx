'use client';
import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/ui/Sidebar';
import { Topbar } from '../../components/ui/Topbar';
import { Card, CardBody } from '../../components/ui/Card';
import { api } from '../../lib/api';
import { useRouter } from 'next/navigation';
import Skeleton from '../../components/ui/Skeleton';

interface Exercise {
  id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  weight?: number;
  restSeconds?: number;
  progression?: any;
}

interface WorkoutPlan {
  id: string;
  name: string;
  dayOfWeek?: number;
  exercises: Exercise[];
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function WorkoutsPage() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
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
      loadWorkouts();
    } catch {
      router.replace('/login');
    }
  };

  const loadWorkouts = async () => {
    try {
      const data = await api('/workouts/student');
      setWorkoutPlans(data);
      if (data.length > 0) {
        const today = new Date().getDay();
        const todayPlan = data.find((p: WorkoutPlan) => p.dayOfWeek === today) || data[0];
        setSelectedPlan(todayPlan);
      }
    } catch (err) {
      console.error('Erro ao carregar treinos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteExercise = async (exerciseId: string, actualWeight?: number) => {
    try {
      await api(`/workouts/exercises/${exerciseId}/complete`, {
        method: 'POST',
        json: { actualWeight },
      });
      loadWorkouts();
    } catch (err) {
      console.error('Erro ao completar exercício:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-card to-dark flex">
        <Sidebar active="workouts" />
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-card to-dark flex">
      <Sidebar active="workouts" />
      <div className="flex-1 flex flex-col">
        <Topbar title="Meus Treinos" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text-primary mb-4">Treino do Dia</h1>
              <div className="flex gap-2 flex-wrap">
                {workoutPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      selectedPlan?.id === plan.id
                        ? 'bg-primary text-white'
                        : 'bg-dark-card text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {plan.dayOfWeek !== undefined ? DAYS[plan.dayOfWeek] : plan.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedPlan && (
              <Card>
                <CardBody>
                  <h2 className="text-xl font-bold text-text-primary mb-6">{selectedPlan.name}</h2>
                  <div className="space-y-4">
                    {selectedPlan.exercises.map((exercise, index) => (
                      <div
                        key={exercise.id}
                        className="p-4 rounded-xl border border-dark-border bg-dark-card"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-primary">
                                {index + 1}.
                              </span>
                              <h3 className="text-lg font-bold text-text-primary">{exercise.name}</h3>
                              {exercise.videoUrl && (
                                <a
                                  href={exercise.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm"
                                >
                                  📹 Ver execução
                                </a>
                              )}
                            </div>
                            {exercise.description && (
                              <p className="text-sm text-text-secondary mb-2">{exercise.description}</p>
                            )}
                            <div className="flex gap-4 text-sm text-text-secondary">
                              <span>
                                <strong className="text-text-primary">{exercise.sets}</strong> séries
                              </span>
                              <span>
                                <strong className="text-text-primary">{exercise.reps}</strong> repetições
                              </span>
                              {exercise.weight && (
                                <span>
                                  <strong className="text-text-primary">{exercise.weight}kg</strong> carga sugerida
                                </span>
                              )}
                              {exercise.restSeconds && (
                                <span>
                                  Descanso: <strong className="text-text-primary">{exercise.restSeconds}s</strong>
                                </span>
                              )}
                            </div>
                            {exercise.progression && (
                              <div className="mt-2 text-xs text-primary">
                                ⚡ Progressão automática: próximo nível em {exercise.progression.nextLevel || 'breve'}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleCompleteExercise(exercise.id, exercise.weight)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                          >
                            Concluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
