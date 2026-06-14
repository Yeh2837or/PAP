import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthService } from '../core/services';
import { FormField, Input } from '../components/ui';
import { SESSION_KEY } from '../core/config';

export function AuthPage({ mode, setMode }) {
  const { toast, setUser } = useApp();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const result = mode === 'login'
      ? await AuthService.login({ email: form.email, password: form.password })
      : await AuthService.register(form);

    setLoading(false);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
    setUser(result.user);
    toast('success', mode === 'login' ? 'Bem-vindo de volta!' : 'Conta criada!', `Olá, ${result.user.name}!`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '42px', marginBottom: '8px' }}>📚</div>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 700 }}>StudentHelper</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Organiza os teus estudos de forma simples</p>
        </div>

        {/* Card */}
        <div className="card">

          {/* Login / Register tabs */}
          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
            {[{ key: 'login', label: 'Entrar' }, { key: 'register', label: 'Registar' }].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setMode(tab.key); setErrors({}); setForm({ name: '', email: '', password: '' }); }}
                style={{
                  flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  fontWeight: 500, fontSize: '14px',
                  background: mode === tab.key ? '#fff' : 'transparent',
                  color: mode === tab.key ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: mode === tab.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Fields */}
          {mode === 'register' && (
            <FormField label="Nome" required error={errors.name}>
              <Input
                value={form.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder="O teu nome completo"
                error={errors.name}
              />
            </FormField>
          )}

          <FormField label="E-mail" required error={errors.email}>
            <Input
              type="email"
              value={form.email}
              onChange={e => updateField('email', e.target.value)}
              placeholder="exemplo@email.com"
              error={errors.email}
            />
          </FormField>

          <FormField label="Palavra-passe" required error={errors.password}>
            <Input
              type="password"
              value={form.password}
              onChange={e => updateField('password', e.target.value)}
              placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'A tua palavra-passe'}
              error={errors.password}
            />
          </FormField>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          >
            {loading ? 'A carregar...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </div>
      </div>
    </div>
  );
}
