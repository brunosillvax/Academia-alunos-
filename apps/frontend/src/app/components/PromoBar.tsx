'use client';

import { useEffect, useMemo, useState } from 'react';

export default function PromoBar({
  deadline,
  whatsapp = '5511999999999',
}: {
  deadline: string; // ISO string
  whatsapp?: string;
}) {
  const [now, setNow] = useState<number>(Date.now());
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const remaining = useMemo(() => {
    const diff = Math.max(0, new Date(deadline).getTime() - now);
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return { days, hours, minutes, seconds };
  }, [now, deadline]);

  if (hidden) return null;

  return (
    <div className="sticky top-0 z-40">
      <div className="w-full backdrop-blur supports-[backdrop-filter]:bg-emerald-600/80 bg-emerald-600 text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <span className="relative inline-flex">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-white/60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="font-semibold text-sm md:text-base">Oferta: 7 dias grátis termina em</span>
            <div className="flex items-center gap-1.5">
              {[
                ['d', remaining.days],
                ['h', remaining.hours],
                ['m', remaining.minutes],
                ['s', remaining.seconds],
              ].map(([label, value]) => (
                <span key={label as string} className="font-mono text-xs md:text-sm bg-white/15 rounded-md px-2 py-0.5">
                  {String(value as number).padStart(2, '0')}{label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsapp}?text=Quero%20aproveitar%20os%207%20dias%20gr%C3%A1tis!`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 shadow"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
              WhatsApp
            </a>
            <button onClick={() => setHidden(true)} className="opacity-80 hover:opacity-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
