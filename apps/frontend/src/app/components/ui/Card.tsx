'use client';
import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl border border-dark-border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`px-6 py-5 border-b border-dark-border ${className}`}>{children}</div>
  );
}

export function CardBody({ children, className = '' }: CardProps) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  gradient,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  trend?: string;
  gradient?: string;
}) {
  return (
    <div className="rounded-2xl border border-dark-border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-3xl font-semibold text-text-primary">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${gradient || 'bg-gradient-to-br from-primary to-primary-light text-white'}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-dark-border">
          <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-accent-success' : 'text-accent-danger'}`}>
            {trend}
          </span>{' '}
          <span className="text-sm text-text-secondary">vs mês anterior</span>
        </div>
      )}
    </div>
  );
}







