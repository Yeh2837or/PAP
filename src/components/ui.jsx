import React from 'react';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../core/config';

export function FormField({ label, error, required, children, hint }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span style={{ color: '#C92A2A' }}> *</span>}
        </label>
      )}
      {hint && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{hint}</div>}
      {children}
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

export function Input({ error, ...props }) {
  return <input {...props} className={`input ${error ? 'has-error' : ''}`} />;
}

export function Textarea({ error, ...props }) {
  return (
    <textarea
      {...props}
      className={`input ${error ? 'has-error' : ''}`}
      style={{ minHeight: '80px', resize: 'vertical' }}
    />
  );
}

export function Select({ error, ...props }) {
  return <select {...props} className={`input ${error ? 'has-error' : ''}`} style={{ cursor: 'pointer' }} />;
}

export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || {};
  return (
    <span style={{
      display: 'inline-flex', padding: '2px 8px', borderRadius: '20px',
      fontSize: '12px', color: cfg.color, background: cfg.bg,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {};
  return (
    <span style={{
      display: 'inline-flex', padding: '2px 8px', borderRadius: '20px',
      fontSize: '12px', color: cfg.color, background: cfg.bg,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{
        width: 28, height: 28,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>{title}</h1>
        {subtitle && <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}