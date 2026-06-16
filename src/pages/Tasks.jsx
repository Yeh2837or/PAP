import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TaskService, SubjectService } from '../core/services';
import { PageHeader, StatusBadge, PriorityBadge, FormField, Input } from '../components/ui';
import { Utils } from '../core/utils';

const EMPTY_FORM = { title: '', subject_id: '', due_date: '', priority: 'média', notes: '' };

export function Tasks() {
  const { user } = useApp();

  const [tasks, setTasks] = useState(() => TaskService.getAll(user.id));
  const subjects = useMemo(() => SubjectService.getAll(user.id), [user.id]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState('all');

  const reload = () => setTasks(TaskService.getAll(user.id));

  const handleSave = () => {
    if (!form.title.trim()) return;
    TaskService.create({ ...form, status: 'não_iniciada' }, user.id);
    setForm(EMPTY_FORM);
    setShowForm(false);
    reload();
  };

  const handleToggle = (id, currentStatus) => {
    const newStatus = currentStatus === 'concluída' ? 'não_iniciada' : 'concluída';
    TaskService.patchStatus(id, newStatus, user.id);
    reload();
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Eliminar "${title}"?`)) return;
    TaskService.delete(id, user.id);
    reload();
  };

  const visibleTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status !== 'concluída';
    if (filter === 'done')    return t.status === 'concluída';
    return true;
  });

  return (
    <div>
      <PageHeader
        title="As Minhas Tarefas"
        subtitle="Gere os teus trabalhos e prazos"
        actions={
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '❌ Cancelar' : '➕ Nova Tarefa'}
          </button>
        }
      />

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', border: '2px solid var(--primary)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Criar Nova Tarefa</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <FormField label="Título da Tarefa">
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Fazer exercícios"
              />
            </FormField>

            <FormField label="Disciplina">
              <select
                className="input"
                value={form.subject_id}
                onChange={e => setForm({ ...form, subject_id: e.target.value })}
              >
                <option value="">Sem disciplina</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Data Limite">
              <Input
                type="date"
                value={form.due_date}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
              />
            </FormField>

            <FormField label="Prioridade">
              <select
                className="input"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              >
                <option value="baixa">⬇ Baixa</option>
                <option value="média">➡ Média</option>
                <option value="alta">⬆ Alta</option>
              </select>
            </FormField>
          </div>

          <FormField label="Notas (opcional)">
            <Input
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Informações adicionais..."
            />
          </FormField>

          <button className="btn btn-primary" onClick={handleSave}>Guardar Tarefa</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { key: 'all',     label: 'Todas' },
          { key: 'pending', label: 'Por fazer' },
          { key: 'done',    label: 'Concluídas' },
        ].map(f => (
          <button
            key={f.key}
            className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visibleTasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>☑️</div>
          <p>{filter === 'done' ? 'Ainda não concluíste nenhuma tarefa.' : 'Nenhuma tarefa encontrada.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleTasks.map(task => {
            const subject = subjects.find(s => s.id === task.subject_id);
            const isOverdue = task.status !== 'concluída' && Utils.isOverdue(task.due_date);

            return (
              <div key={task.id} className="card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 16px' }}>
                <input
                  type="checkbox"
                  checked={task.status === 'concluída'}
                  onChange={() => handleToggle(task.id, task.status)}
                  style={{ marginTop: '3px', width: '16px', height: '16px', cursor: 'pointer' }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, textDecoration: task.status === 'concluída' ? 'line-through' : 'none', color: task.status === 'concluída' ? 'var(--text-muted)' : 'var(--text)' }}>
                    {task.title}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px', alignItems: 'center' }}>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    {subject && (
                      <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '20px', background: `${subject.color}20`, color: subject.color }}>
                        {subject.name}
                      </span>
                    )}
                    {task.due_date && (
                      <span style={{ fontSize: '12px', color: isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
                        📆 {Utils.formatDate(task.due_date)}
                        {isOverdue && ' (em atraso)'}
                      </span>
                    )}
                  </div>

                  {task.notes && (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{task.notes}</div>
                  )}
                </div>

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDelete(task.id, task.title)}
                  style={{ color: 'var(--danger)', flexShrink: 0 }}
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}