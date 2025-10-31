'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@gymflow.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Bem-vindo ao GymFlow</h1>
          <p className="text-text-secondary">Entre para acessar sua conta</p>
        </div>

        {/* Demo Credentials - prominent */}
        <div className="mb-4 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-primary-light/10 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">👤 Credenciais de Demonstração</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-white rounded border border-dark-border text-text-primary">admin@gymflow.local</span>
                <span className="px-2 py-1 bg-white rounded border border-dark-border text-text-primary">admin123</span>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText('admin@gymflow.local / admin123'); }}
                  className="ml-auto text-primary hover:text-primary-light font-medium"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="card-float p-8 animate-slide-up">
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                const res = await fetch(`${api}/auth/login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password }),
                  credentials: 'include',
                });
                if (!res.ok) {
                  setError('Credenciais inválidas');
                  setLoading(false);
                  return;
                }
                router.push('/admin');
              } catch (err) {
                setError('Erro ao conectar ao servidor');
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                className="input-modern"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <input
                className="input-modern"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-accent-danger/10 border border-accent-danger/30 text-accent-danger px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/pre-register" className="text-sm text-primary hover:text-primary-light font-medium">
              Não tem uma conta? Cadastre-se
            </a>
          </div>
        </div>


      </div>
    </main>
  );
}
