import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DastarkhwanApp from './DastarkhwanApp';
import CustomerMenu from './CustomerMenu';
import './index.css';

const isCustomerMenu = window.location.pathname === '/menu';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isCustomerMenu ? <CustomerMenu /> : <DastarkhwanApp />}
  </StrictMode>,
);
