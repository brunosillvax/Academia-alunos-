'use client';
import React from 'react';

export function Sidebar({ active = 'dashboard' }: { active?: string }) {
  const LinkItem = ({ href, label, icon, keyName }: { href: string; label: string; icon: React.ReactNode; keyName: string }) => (
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active === keyName
          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md'
          : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </a>
  );

  return (
    <aside className="w-64 border-r border-dark-border bg-white h-screen sticky top-0 hidden lg:flex lg:flex-col">
      <div className="px-6 py-5 border-b border-dark-border">
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold text-text-primary">GymFlow</p>
            <p className="text-xs text-text-secondary">Sistema de Gestão</p>
          </div>
        </a>
      </div>
      <nav className="p-4 space-y-1 flex-1">
        <LinkItem href="/admin" label="Dashboard" keyName="dashboard" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>} />
        <LinkItem href="/admin/students" label="Alunos" keyName="students" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-1a4 4 0 00-4-4h-1M9 20H4v-1a4 4 0 014-4h1M12 12a5 5 0 100-10 5 5 0 000 10z"/></svg>} />
        <LinkItem href="/plans" label="Planos" keyName="plans" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>} />
        <LinkItem href="/schedule" label="Horários" keyName="schedule" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>} />
        <LinkItem href="/modalities" label="Modalidades" keyName="modalities" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>} />
        <LinkItem href="/admin/campaigns" label="Campanhas" keyName="campaigns" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>} />
      </nav>
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-sm">A</div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-text-primary">Administrador</p>
            <p className="text-xs text-text-secondary">admin@gymflow.local</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
