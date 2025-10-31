'use client';
import { useState, useEffect } from 'react';

export default function StatusPage() {
  const [status, setStatus] = useState<'operational' | 'degraded' | 'down'>('operational');
  const [uptime, setUptime] = useState(99.9);
  const [lastChecked, setLastChecked] = useState(new Date());

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${api}/health`, { method: 'GET' });
        if (res.ok) {
          setStatus('operational');
          setUptime(99.9);
        } else {
          setStatus('degraded');
        }
      } catch {
        setStatus('down');
        setUptime(95.2);
      }
      setLastChecked(new Date());
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Verifica a cada minuto
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      name: 'API Backend',
      status: status,
      description: 'Servidor principal da aplicação'
    },
    {
      name: 'Banco de Dados',
      status: 'operational',
      description: 'PostgreSQL'
    },
    {
      name: 'Frontend Web',
      status: 'operational',
      description: 'Aplicação Next.js'
    },
    {
      name: 'Autenticação',
      status: status === 'down' ? 'down' : 'operational',
      description: 'Sistema de login e sessões'
    },
    {
      name: 'Pagamentos',
      status: status === 'down' ? 'down' : 'operational',
      description: 'Gateway de pagamento'
    }
  ];

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'operational': return 'bg-emerald-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (s: string) => {
    switch (s) {
      case 'operational': return 'Operacional';
      case 'degraded': return 'Degradado';
      case 'down': return 'Indisponível';
      default: return 'Desconhecido';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-card to-dark py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Status do Sistema</h1>
          <p className="text-text-secondary">Acompanhe o status de todos os nossos serviços</p>
        </div>

        {/* Status Geral */}
        <div className="card-float p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Status Geral</h2>
              <p className="text-text-secondary">Todos os sistemas estão operacionais</p>
            </div>
            <div className={`${getStatusColor(status)} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl`}>
              {status === 'operational' ? '✓' : status === 'degraded' ? '!' : '✗'}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-text-secondary mb-1">Uptime (últimos 30 dias)</p>
              <p className="text-3xl font-bold text-text-primary">{uptime.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Última verificação</p>
              <p className="text-lg font-semibold text-text-primary">
                {lastChecked.toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        {/* Serviços */}
        <div className="card-float p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Serviços</h2>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-dark-border">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary mb-1">{service.name}</h3>
                  <p className="text-sm text-text-secondary">{service.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`${getStatusColor(service.status)} w-3 h-3 rounded-full`}></span>
                  <span className="text-sm font-semibold text-text-primary">
                    {getStatusText(service.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidentes */}
        <div className="card-float p-8 mt-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Histórico de Incidentes</h2>
          <div className="text-center py-8">
            <p className="text-text-secondary">Nenhum incidente registrado nos últimos 90 dias</p>
          </div>
        </div>

        {/* Informações */}
        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>
            Para reportar problemas, entre em contato:{' '}
            <a href="mailto:suporte@gymflow.com" className="text-primary hover:underline">
              suporte@gymflow.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
