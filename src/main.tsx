import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DastarkhwanApp from './DastarkhwanApp';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DastarkhwanApp />
  </StrictMode>,
);
