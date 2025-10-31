'use client';
import React from 'react';

export function Topbar({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <header className="h-16 border-b border-dark-border bg-white/90 backdrop-blur sticky top-0 z-30 flex items-center">
      <div className="w-full px-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-border bg-white shadow-sm">
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input className="bg-transparent outline-none text-sm placeholder:text-text-secondary w-40" placeholder="Buscar" />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-gray-100 text-text-secondary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
          </div>
          {right}
        </div>
      </div>
    </header>
  );
}







