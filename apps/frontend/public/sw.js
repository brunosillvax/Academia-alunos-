// Service Worker para Web Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'GymFlow', body: 'Você tem uma nova notificação' };

  const options = {
    body: data.body,
    // Icons are optional - will use default browser icon if not found
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' },
    ],
  };

  // Remove icon properties if files don't exist (browser will use default)
  // Note: This is handled by the browser automatically - missing icons won't break notifications

  event.waitUntil(
    self.registration.showNotification(data.title || 'GymFlow', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});
