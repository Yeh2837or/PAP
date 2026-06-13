import React from 'react';
import { useApp } from '../context/AppContext';
import { SESSION_KEY } from '../core/config';

export function AppLayout({ page, setPage, children }) {
  const { setUser } = useApp();

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    
 };

  const navItems = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'calendar',  icon: '📅', label: 'Calendário' },
    { key: 'subjects',  icon: '📘', label: 'Disciplinas' },
    { key: 'tasks',     icon: '✅', label: 'Tarefas' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside style={{
        width: '240px',
        background: '#fff',
        padding: '24px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
          <span style={{ fontSize: '26px' }}>📚</span>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>StudentHelper</h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '8px', border: 'none',
                cursor: 'pointer',
                fontWeight: page === item.key ? 600 : 400,
                background: page === item.key ? 'var(--primary-light)' : 'transparent',
                color: page === item.key ? 'var(--primary)' : 'var(--text)',
                fontSize: '14px', width: '100%', textAlign: 'left',
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', background: 'transparent',
            color: 'var(--danger)', fontSize: '14px', width: '100%',
          }}
        >
          🚪 Terminar sessão
        </button>
      </aside>

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}