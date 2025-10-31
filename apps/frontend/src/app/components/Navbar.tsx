'use client';
import { useState, useEffect } from 'react';

export default function Navbar({ activePage = '' }: { activePage?: string }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${api}/auth/me`, { credentials: 'include' })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        const u = data?.user || null;
        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    const cookieName = (process.env.NEXT_PUBLIC_COOKIE_NAME as string) || 'gf_token';
    document.cookie = `${cookieName}=; Max-Age=0; path=/`;
    window.location.href = '/';
  };

  return (
    <nav className="bg-dark-sidebar/80 backdrop-blur border-b border-dark-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary">GymFlow</span>
          </a>
          <div className="flex items-center gap-6">
            {user?.role === 'ADMIN' ? (
              // Menu Admin
              <>
                <a href="/admin" className={`transition-colors text-sm font-medium ${activePage === 'admin' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>
                  Dashboard
                </a>
                <a href="/admin/students" className={`transition-colors text-sm font-medium ${activePage === 'students' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>
                  Alunos
                </a>
                <a href="/admin/schedule" className={`transition-colors text-sm font-medium ${activePage === 'admin-schedule' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>
                  Horários
                </a>
              </>
            ) : user?.role === 'STUDENT' ? (
              // Menu Aluno
              <>
                <a href="/student" className={`transition-colors text-sm font-medium ${activePage === 'student' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>
                  Meu Perfil
                </a>
                <a href="/student/progress" className={`transition-colors text-sm font-medium ${activePage === 'progress' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>
                  Evolução
                </a>
                <a href="/student/payments" className={`transition-colors text-sm font-medium ${activePage === 'payments' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>
                  Pagamentos
                </a>
              </>
            ) : (
              // Menu Público
              <>
                <a href="/blog" className={`transition-colors text-sm font-medium ${activePage === 'blog' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>
                  Blog
                </a>
                <a href="/equipe" className={`transition-colors text-sm font-medium ${activePage === 'equipe' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>
                  Equipe
                </a>
                <a href="/resultados" className={`transition-colors text-sm font-medium ${activePage === 'resultados' ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>
                  Resultados
                </a>
              </>
            )}
            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <a href={user.role === 'ADMIN' ? '/admin' : '/student'} className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                    {user.name}
                  </a>
                  <button onClick={handleLogout} className="btn-secondary text-sm">
                    Sair
                  </button>
                </div>
              ) : (
                <a href="/login" className="btn-primary text-sm">Entrar</a>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
