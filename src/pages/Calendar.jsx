import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TaskService, SubjectService } from '../core/services';
import { PageHeader } from '../components/ui';
import { Utils } from '../core/utils';

export function Calendar() {
  const { user } = useApp();
  const [tasks] = useState(() => TaskService.getAll(user.id));
  const subjects = useMemo(() => SubjectService.getAll(user.id), [user.id]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  // grid
  const gridDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    let dayOfWeek = firstDay.getDay(); // 0 = Sunday
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 

    const startDate = new Date(currentYear, currentMonth, 1 - dayOfWeek);
    const days = [];

    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentMonth, currentYear]);

  const todayStr = Utils.today();

  return (
    <div>
      <PageHeader
        title="O Meu Calendário"
        subtitle="Visualiza os teus prazos numa vista mensal"
      />

      {/* what month */}
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
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrentDate(new Date())}>Hoje</button>
          <button className="btn btn-ghost btn-sm" onClick={nextMonth}>▶</button>
        </div>
      </div>

      {/* grid */}
      <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>

        {/* weekday */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '10px' }}>
          {Utils.ptWeekdays.map(day => (
            <div key={day} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', padding: '4px' }}>
              {day}
            </div>
          ))}
        </div>

        {/* day grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {gridDays.map((date, index) => {
            const dateStr = Utils.dateToISO(date);
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = dateStr === todayStr;
            const dayTasks = tasks.filter(t => t.due_date === dateStr);

            return (
              <div
                key={index}
                style={{
                  background: isToday ? '#EFF6FF' : '#fff',
                  border: isToday ? '2px solid var(--primary)' : '1px solid #f0f0f0',
                  borderRadius: '8px',
                  padding: '8px',
                  minHeight: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: isCurrentMonth ? 1 : 0.35,
                }}
              >
                {/* what day */}
                <span style={{
                  fontSize: '13px',
                  fontWeight: isToday ? 700 : 500,
                  color: isToday ? 'var(--primary)' : 'var(--text)',
                  marginBottom: '5px',
                }}>
                  {date.getDate()}
                </span>

                {/* today tasks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, overflow: 'hidden' }}>
                  {dayTasks.slice(0, 3).map(task => {
                    const subject = subjects.find(s => s.id === task.subject_id);
                    return (
                      <div
                        key={task.id}
                        title={task.title}
                        style={{
                          fontSize: '11px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: subject ? `${subject.color}18` : '#f3f4f6',
                          color: subject ? subject.color : '#6b7280',
                          borderLeft: `3px solid ${subject ? subject.color : '#d1d5db'}`,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textDecoration: task.status === 'concluída' ? 'line-through' : 'none',
                          opacity: task.status === 'concluída' ? 0.6 : 1,
                        }}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+{dayTasks.length - 3} mais</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
