import ReactDOM from 'react-dom/client';
import React, { Suspense } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { App } from 'src/app';
import { GlobalStyle } from './global/styles';
import ErrorBoundary from './components/error-boundary';

// Global error handler for chunk loading errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.name === 'ChunkLoadError') {
    console.warn('Chunk loading error detected, reloading page to clear cache...');
    // Clear any cached data that might be causing issues
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
});

// Handle unhandled promise rejections (chunk loading errors often appear here)
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.name === 'ChunkLoadError') {
    console.warn('Unhandled chunk loading error, reloading page...');
    event.preventDefault();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
});


const root = ReactDOM.createRoot(document.getElementById('root'));

const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

root.render(
  <ErrorBoundary>
    <HelmetProvider>
      <Router>
        <Suspense>
          <GlobalStyle />
          <App />
        </Suspense>
      </Router>
    </HelmetProvider>
  </ErrorBoundary>
);
