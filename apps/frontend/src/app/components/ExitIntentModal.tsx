'use client';

import { useEffect, useState } from 'react';

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setOpen(true);
    };
    window.addEventListener('mouseout', onLeave);
    return () => {
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-light text-white px-6 py-4">
          <h3 className="text-lg font-bold">Avaliação gratuita em 7 dias</h3>
          <p className="text-white/90 text-sm">Receba contato no WhatsApp para marcar sua avaliação física.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Nome</label>
            <input className="input-modern" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">WhatsApp</label>
            <input className="input-modern" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setOpen(false)} className="btn-secondary">Agora não</button>
            <a
              href={`https://wa.me/5511999999999?text=Quero%20minha%20avalia%C3%A7%C3%A3o%20gratuita.%20Nome:%20${encodeURIComponent(name)}%20-%20Tel:%20${encodeURIComponent(phone)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              onClick={() => setOpen(false)}
            >
              Pedir contato
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
