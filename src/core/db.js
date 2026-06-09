import { STORAGE_KEY } from './config';
import { Utils } from './utils';

// Simple local storage database
const DB = {
  load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  },

  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  getTable(table) {
    return this.load()[table] || [];
  },

  setTable(table, rows) {
    const data = this.load();
    data[table] = rows;
    this.save(data);
  },

  insert(table, row) {
    const rows = this.getTable(table);
    const now = Utils.now();
    const newRow = { id: Utils.uuid(), created_at: now, updated_at: now, ...row };
    rows.push(newRow);
    this.setTable(table, rows);
    return newRow;
  },

  update(table, id, updates) {
    const rows = this.getTable(table);
    const index = rows.findIndex(r => r.id === id);
    if (index === -1) return null;
    rows[index] = { ...rows[index], ...updates, updated_at: Utils.now() };
    this.setTable(table, rows);
    return rows[index];
  },

  delete(table, id) {
    const rows = this.getTable(table).filter(r => r.id !== id);
    this.setTable(table, rows);
  },

  findOne(table, matchFn) {
    return this.getTable(table).find(matchFn) || null;
  },

  findAll(table, filterFn) {
    const rows = this.getTable(table);
    return filterFn ? rows.filter(filterFn) : rows;
  },
};

export const UserRepository = {
  findByEmail: (email) => DB.findOne('users', u => u.email.toLowerCase() === email.toLowerCase()),
  findById: (id) => DB.findOne('users', u => u.id === id),
  create: (data) => DB.insert('users', data),
  update: (id, data) => DB.update('users', id, data),
};

export const SubjectRepository = {
  findAll: (userId) => DB.findAll('subjects', s => s.user_id === userId),
  findById: (id, userId) => DB.findOne('subjects', s => s.id === id && s.user_id === userId),
  create: (data) => DB.insert('subjects', data),
  update: (id, data) => DB.update('subjects', id, data),
  delete: (id) => DB.delete('subjects', id),
};

export const TaskRepository = {
  findAll: (userId) => DB.findAll('tasks', t => t.user_id === userId),
  findById: (id, userId) => DB.findOne('tasks', t => t.id === id && t.user_id === userId),
  create: (data) => DB.insert('tasks', data),
  update: (id, data) => DB.update('tasks', id, data),
  delete: (id) => DB.delete('tasks', id),
};

export const EventRepository = {
  findAll: (userId) => DB.findAll('events', e => e.user_id === userId),
  findById: (id, userId) => DB.findOne('events', e => e.id === id && e.user_id === userId),
  create: (data) => DB.insert('events', data),
  update: (id, data) => DB.update('events', id, data),
  delete: (id) => DB.delete('events', id),
};

export const ActivityRepository = {
  log: (userId, action, entity, detail) =>
    DB.insert('activity_log', { user_id: userId, action, entity, detail }),

  recent: (userId, limit = 10) =>
    DB.findAll('activity_log', a => a.user_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit),
};
