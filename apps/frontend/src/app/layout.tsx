import './globals.css';
import React from 'react';
import Hotjar from './components/Hotjar';
import WebPushNotifications from './components/WebPushNotifications';

export const metadata = {
  title: 'GymFlow',
  description: 'Gestao de academia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-dark text-text-primary">
        <Hotjar />
        <WebPushNotifications />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(() => console.log('SW registered'))
                    .catch(err => console.log('SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
