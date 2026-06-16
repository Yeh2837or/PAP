import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubjectService } from '../core/services';
import { PageHeader, FormField, Input } from '../components/ui';
import { SUBJECT_COLORS } from '../core/config';

export function Subjects() {
  const { user } = useApp();

  const [subjects, setSubjects] = useState(() => SubjectService.getAll(user.id));
  const [form, setForm] = useState({ name: '', color: SUBJECT_COLORS[0].value });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const reload = () => setSubjects(SubjectService.getAll(user.id));

  const save = () => {
    const result = editingId
      ? SubjectService.update(editingId, form, user.id)
      : SubjectService.create(form, user.id);

    if (!result.ok) {
      setErrors(result.errors || {});
      return;
    }

    setForm({ name: '', color: SUBJECT_COLORS[0].value });
    setEditingId(null);
    setErrors({});
    reload();
  };

  const startEdit = (subject) => {
    setEditingId(subject.id);
    setForm({ name: subject.name, color: subject.color });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', color: SUBJECT_COLORS[0].value });
    setErrors({});
  };

  const remove = (id, name) => {
    if (!window.confirm(`Tens a certeza que queres eliminar "${name}"?`)) return;
    SubjectService.delete(id, user.id);
    reload();
  };

  return (
    <div>
      <PageHeader
        title="As Minhas Disciplinas"
        subtitle="Gere as tuas cadeiras e atribui-lhes cores"
      />

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Form */}
        <div className="card" style={{ flex: '1 1 280px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>
            {editingId ? 'Editar Disciplina' : 'Nova Disciplina'}
          </h3>

          <FormField label="Nome" required error={errors.name}>
            <Input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Matemática"
              error={errors.name}
            />
          </FormField>

          <FormField label="Cor" required error={errors.color}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SUBJECT_COLORS.map(c => (
                <div
                  key={c.value}
                  title={c.label}
                  onClick={() => setForm({ ...form, color: c.value })}
                  style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: c.value, cursor: 'pointer',
                    border: form.color === c.value ? '3px solid var(--text)' : '2px solid transparent',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }}
                />
              ))}
            </div>
          </FormField>

          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={save} style={{ flex: 1, justifyContent: 'center' }}>
              Guardar
            </button>
            {editingId && (
              <button className="btn btn-ghost" onClick={cancelEdit}>Cancelar</button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: '2 1 320px' }}>
          {subjects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>✏️</div>
              <p>Ainda não tens disciplinas. Cria a uma nova!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {subjects.map(subject => (
                <div key={subject.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: subject.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontWeight: 500 }}>{subject.name}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(subject)}>✏️ Editar</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => remove(subject.id, subject.name)} style={{ color: 'var(--danger)' }}>🗑️ Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}