// App.tsx
import './App.css';
import AppRouter from './routes/AppRouter';
import { App as CapacitorApp } from '@capacitor/app';
import { useEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';

function AppInner() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let removeListener: (() => void) | undefined;

    CapacitorApp.addListener('backButton', () => {
      if (location.pathname === '/' || location.pathname === '/home') {
        CapacitorApp.exitApp();
      } else {
        navigate(-1);
      }
    }).then(listener => {
      removeListener = listener.remove;
    });

    return () => {
      if (removeListener) removeListener();
    };
  }, [location.pathname]);

  return <AppRouter />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
