'use client';
import { useEffect } from 'react';
import { isFeatureEnabled } from '../lib/features';

export default function Hotjar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isFeatureEnabled('hotjarEnabled')) return;

    const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;
    if (!hotjarId) return;

    // Carrega script do Hotjar
    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid: parseInt(hotjarId, 10), hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = true;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }, []);

  return null;
}
