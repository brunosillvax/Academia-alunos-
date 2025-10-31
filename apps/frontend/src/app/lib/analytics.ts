/**
 * Analytics simples para eventos customizados
 * Envia para o backend se disponível, senão apenas loga
 */
const API_URL = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') : '';

export type AnalyticsEventType =
  | 'CLICK_CTA'
  | 'FORM_ABANDON'
  | 'FORM_START'
  | 'FORM_COMPLETE'
  | 'VIDEO_PLAY'
  | 'MODAL_OPEN'
  | 'MODAL_CLOSE'
  | 'PAGE_VIEW';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  page?: string;
  data?: Record<string, any>;
  userId?: string;
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    // Tenta enviar para backend se autenticado
    if (API_URL) {
      const response = await fetch(`${API_URL}/analytics/event`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        console.warn('Analytics event failed to send:', event);
      }
    } else {
      // Fallback: apenas log em dev
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', event);
      }
    }
  } catch (err) {
    // Silencioso em produção
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics error:', err);
    }
  }
}

// Helpers
export function trackCTAClick(ctaText: string, page?: string) {
  trackEvent({ type: 'CLICK_CTA', page, data: { ctaText } });
}

export function trackFormAbandon(formName: string, step?: number, fields?: string[]) {
  trackEvent({
    type: 'FORM_ABANDON',
    page: formName,
    data: { step, fields }
  });
}

export function trackFormStart(formName: string) {
  trackEvent({ type: 'FORM_START', page: formName });
}

export function trackFormComplete(formName: string) {
  trackEvent({ type: 'FORM_COMPLETE', page: formName });
}
