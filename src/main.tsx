import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress ResizeObserver loop errors which are benign but noisy
const originalError = console.error;
console.error = (...args) => {
  if (
    args.length > 0 &&
    typeof args[0] === 'string' &&
    args[0].includes('ResizeObserver loop')
  ) {
    return; // Suppress ResizeObserver errors
  }
  originalError(...args);
};

// Handle unhandled errors including ResizeObserver
window.addEventListener('error', (e) => {
  if (e.message.includes('ResizeObserver loop')) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.toString().includes('ResizeObserver loop')) {
    e.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
