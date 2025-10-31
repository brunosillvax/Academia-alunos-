'use client';
import { useEffect, useState } from 'react';

export default function WebPushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (err) {
      console.error('Erro ao verificar subscription:', err);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações');
      return;
    }

    const perm = await Notification.requestPermission();
    setPermission(perm);

    if (perm === 'granted') {
      await subscribeToPush();
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Chave pública do VAPID (em produção, gerar com biblioteca web-push)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'DEMO_KEY';

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Enviar subscription para o backend
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${api}/push/subscribe`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });

      setSubscription(sub);
    } catch (err) {
      console.error('Erro ao se inscrever:', err);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  };

  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return null;
  }

  if (permission === 'granted' && subscription) {
    return (
      <div className="fixed bottom-6 left-6 z-50 bg-green-500/10 border border-green-500/30 rounded-lg p-4 max-w-sm">
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
          </svg>
          Notificações ativadas
        </div>
      </div>
    );
  }

  if (permission === 'default') {
    return (
      <div className="fixed bottom-6 left-6 z-50 bg-primary/10 border border-primary/30 rounded-lg p-4 max-w-sm shadow-lg">
        <p className="text-sm text-text-primary mb-3 font-semibold">
          Receba lembretes de treino e pagamento
        </p>
        <button
          onClick={requestPermission}
          className="btn-primary text-sm w-full"
        >
          Ativar Notificações
        </button>
      </div>
    );
  }

  return null;
}
