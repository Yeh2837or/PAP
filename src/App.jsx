import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout';
import { AuthPage } from './pages/AuthPage';

function MainRouter() {
  const { user } = useApp();
  const [page, setPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');

  if (!user) {
    return <AuthPage mode={authMode} setMode={setAuthMode} />;
  }

  return (
    <AppLayout page={page} setPage={setPage}>
      <div style={{ padding: '32px', color: 'var(--text-muted)' }}>
        Em construção...
      </div>
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}