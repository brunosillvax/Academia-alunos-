'use client';
import { useState, useEffect, useRef } from 'react';
import { trackFormStart, trackFormComplete, trackFormAbandon } from '../lib/analytics';

export default function PreRegisterPage() {
  const [ok, setOk] = useState(false);
  const [step, setStep] = useState(1); // 1: dados básicos, 2: objetivo, 3: disponibilidade, 4: confirmar
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', goal: '', availability: '' });
  const totalSteps = 4;
  const formStarted = useRef(false);

  useEffect(() => {
    trackFormStart('pre-register');
    formStarted.current = true;

    // Detecta saída da página para tracking de abandono
    const handleBeforeUnload = () => {
      if (!ok && formStarted.current) {
        trackFormAbandon('pre-register', step, Object.keys(formData).filter(k => formData[k as keyof typeof formData]));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step, ok]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Pré-Cadastro</h1>
          <p className="text-text-secondary">Comece sua jornada fitness agora mesmo!</p>
        </div>

        {/* Progress */}
        {!ok && (
          <div className="mb-4">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
            </div>
            <p className="text-xs text-text-secondary mt-2">Etapa {step} de {totalSteps}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="card-float p-8 animate-slide-up">
          {ok ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">Cadastro Recebido!</h2>
              <p className="text-text-secondary mb-6">Recebemos seus dados com sucesso. Em breve nossa equipe entrará em contato.</p>
              <div className="bg-primary/10 rounded-xl p-4">
                <p className="text-sm text-text-primary">
                  <strong>Próximos passos:</strong> Você receberá um e-mail com mais informações sobre planos e horários disponíveis.
                </p>
              </div>
              <button
                onClick={() => setOk(false)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                Fazer Outro Cadastro
              </button>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (step < totalSteps) {
                  setStep(step + 1);
                } else {
                  trackFormComplete('pre-register');
                  setOk(true);
                }
              }}
            >
              {step === 1 && (
                <>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Nome Completo
                </label>
                    <input className="input-modern" placeholder="Seu nome completo" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  E-mail
                </label>
                    <input className="input-modern" placeholder="seu@email.com" type="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.04 3.12a1 1 0 01-.502 1.21l-2.1 1.05a11.042 11.042 0 006.017 6.017l1.05-2.1a1 1 0 011.21-.502l3.12 1.04a1 1 0 01.684.949V19a2 2 0 01-2 2h-1A16 16 0 013 5z"/></svg>
                  Telefone (Opcional)
                </label>
                    <input className="input-modern" placeholder="(00) 00000-0000" type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})} />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Qual seu objetivo principal?</label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { key: 'emagrecimento', label: 'Emagrecimento' },
                      { key: 'hipertrofia', label: 'Hipertrofia' },
                      { key: 'qualidade', label: 'Qualidade de vida' },
                    ].map((o) => (
                      <button
                        type="button"
                        key={o.key}
                        onClick={()=>setFormData({...formData, goal: o.key})}
                        className={`px-4 py-3 rounded-xl border ${formData.goal===o.key?'border-primary bg-primary/10 text-text-primary':'border-dark-border text-text-secondary hover:text-text-primary hover:border-primary/50'}`}
                      >{o.label}</button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Quais dias/horários você tem disponibilidade?</label>
                  <textarea className="input-modern h-28" placeholder="Ex.: Seg/Qua/Sex após as 18h" value={formData.availability} onChange={(e)=>setFormData({...formData,availability:e.target.value})} />
                </>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-text-primary">Revise suas informações</h3>
                  <div className="bg-white/5 border border-dark-border rounded-xl p-4 text-sm text-text-secondary">
                    <p><strong>Nome:</strong> {formData.name}</p>
                    <p><strong>E-mail:</strong> {formData.email}</p>
                    <p><strong>Telefone:</strong> {formData.phone || '—'}</p>
                    <p><strong>Objetivo:</strong> {formData.goal || '—'}</p>
                    <p><strong>Disponibilidade:</strong> {formData.availability || '—'}</p>
                  </div>
              </div>
              )}

              <div className="flex justify-between pt-2">
                <button type="button" onClick={()=>setStep(Math.max(1, step-1))} className="btn-secondary">Voltar</button>
                <button type="submit" className="btn-primary">{step<totalSteps? 'Continuar' : 'Enviar Cadastro'}</button>
              </div>

              <div className="text-center">
                <a href="/login" className="text-sm text-primary hover:text-primary-light font-medium">Já tem uma conta? Faça login</a>
              </div>
            </form>
          )}
        </div>

        {/* Info Cards */}
        {!ok && (
            <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="card-glass p-4 text-center text-white">
              <div className="text-2xl mb-2 flex justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <p className="text-sm text-white/90 font-medium">Resposta Rápida</p>
            </div>
            <div className="card-glass p-4 text-center text-white">
              <div className="text-2xl mb-2 flex justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.761 0-5 2.239-5 5v1h10v-1c0-2.761-2.239-5-5-5zM17 8V6a5 5 0 00-10 0v2"/></svg>
              </div>
              <p className="text-sm text-white/90 font-medium">Dados Seguros</p>
            </div>
            <div className="card-glass p-4 text-center text-white">
              <div className="text-2xl mb-2 flex justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6l-8 6 8 6 8-6-8-6z"/></svg>
              </div>
              <p className="text-sm text-white/90 font-medium">Sem Compromisso</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
