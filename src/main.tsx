import './index.scss';
import './i18n';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
