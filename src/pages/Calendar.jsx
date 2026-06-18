import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui';
import { Utils } from '../core/utils';

export function Calendar() {
  const { user } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const daysInMonth = Utils.getDaysInMonth(currentYear, currentMonth);

  return (
    <div>
      <PageHeader
        title="O Meu Calendário"
        subtitle="Visualiza os teus prazos numa vista mensal"
      />

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px', background: '#fff', padding: '14px 18px',
        borderRadius: '12px', border: '1px solid var(--border)',
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          📅 {Utils.ptMonths[currentMonth]} {currentYear}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost btn-sm" onClick={prevMonth}>◀</button>
          <button className="btn btn-ghost btn-sm" onClick={nextMonth}>▶</button>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '10px' }}>
          {Utils.ptWeekdays.map(day => (
            <div key={day} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', padding: '4px' }}>
              {day}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
            <div key={day} style={{
              background: '#fff', border: '1px solid #f0f0f0',
              borderRadius: '8px', padding: '8px', minHeight: '90px',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
