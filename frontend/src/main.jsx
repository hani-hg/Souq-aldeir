import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import './styles.css';
import './market-refinement.css';
import './pwa.css';
import './luxury-market.css';
import './reference-match.css';
import './blue-classified.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    let refreshed = false;
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.update();
      if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }).catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshed) { refreshed = true; window.location.reload(); }
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
