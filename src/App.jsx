import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Subjects } from './pages/Subjects';

function MainRouter() {
  const { user } = useApp();
  const [page, setPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');

  if (!user) {
    return <AuthPage mode={authMode} setMode={setAuthMode} />;
  }

  return (
    <AppLayout page={page} setPage={setPage}>
      {page === 'dashboard' && <Dashboard setPage={setPage} />}
      {page === 'subjects'  && <Subjects />}
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



