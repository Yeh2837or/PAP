export const Utils = {
  now: () => new Date().toISOString(),

   today: () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },
  
  formatDate: (isoDate) => {
    if (!isoDate) return '';
    const d = new Date(isoDate.includes('T') ? isoDate : isoDate + 'T00:00:00');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
  },
   
  isOverdue: (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr + 'T23:59:59') < new Date();
  },

  isDueToday: (dateStr) => dateStr === Utils.today(),

  isDueSoon: (dateStr, days = 3) => {
    if (!dateStr) return false;
    const due = new Date(dateStr + 'T23:59:59');
    const limit = new Date();
    limit.setDate(limit.getDate() + days);
    return due >= new Date() && due <= limit;
  },

  dateToISO: (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },
  
  addDays: (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  },

  
  uuid: () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`,

  ptMonths: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  ptWeekdays: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],

  getDaysInMonth: (year, month) => new Date(year, month + 1, 0).getDate(),
};