import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress ResizeObserver loop errors which are benign but noisy
const resizeObserverError = /^[^(ResizeObserver loop limit exceeded)]/;
const originalError = console.error;
console.error = (...args) => {
  if (resizeObserverError.test(args[0])) {
    originalError(...args);
  }
};

// Also handle the specific ResizeObserver error in window
window.addEventListener('error', (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.preventDefault();
    e.stopPropagation();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
