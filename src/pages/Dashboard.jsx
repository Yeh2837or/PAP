import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardService } from '../core/services';
import { Utils } from '../core/utils';
import { PageHeader } from '../components/ui';

export function Dashboard({ setPage }) {
  const { user } = useApp();
  const summary = useMemo(() => DashboardService.getSummary(user.id), [user.id]);

  const completionPct = summary.total_tasks > 0
    ? Math.round((summary.completed / summary.total_tasks) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title={`Olá, ${user.name.split(' ')[0]}! 👋`}
        subtitle={`Hoje é ${Utils.formatDate(Utils.today())}. Aqui está o teu resumo.`}
      />

      {/* statistic */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <StatCard icon="🎒" label="Total de tarefas" value={summary.total_tasks} color="var(--primary)"  onClick={() => setPage('tasks')} />
        <StatCard icon="✅" label="Concluídas"        value={summary.completed}   color="var(--success)" onClick={() => setPage('tasks')} />
        <StatCard icon="⏰" label="Em atraso"         value={summary.overdue}     color="var(--danger)"  onClick={() => setPage('tasks')} />
        <StatCard icon="🔥" label="Para hoje"         value={summary.due_today}   color="var(--warning)" onClick={() => setPage('tasks')} />
      </div>

      {/* bar */}
      {summary.total_tasks > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Progresso geral</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>{completionPct}%</span>
          </div>
          <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${completionPct}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--success))',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      )}

      {/* tasks */}
      {summary.tasks_due_soon.length > 0 && (
        <div className="card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>⏰ A vencer em breve</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {summary.tasks_due_soon.map(task => (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg)', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{task.title}</span>
                <span style={{ fontSize: '13px', color: Utils.isOverdue(task.due_date) ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {task.due_date ? Utils.formatDate(task.due_date) : 'Sem data'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* no data */}
      {summary.total_tasks === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🖊️</div>
          <p style={{ margin: 0 }}>Ainda não tens tarefas. Começa por criar uma!</p>
          <button className="btn btn-primary" onClick={() => setPage('tasks')} style={{ marginTop: '16px' }}>
            Criar tarefa
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, onClick }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', padding: '16px' }}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <div style={{ fontSize: '28px', fontWeight: 700, color, margin: '6px 0 2px' }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}
