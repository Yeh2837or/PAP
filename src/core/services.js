import { Validators } from './validators';
import { UserRepository, SubjectRepository, TaskRepository, EventRepository, ActivityRepository } from './db';
import { Utils } from './utils';

export const AuthService = {
  register: async (data) => {
    const errors = Validators.user.register(data);
    if (Object.keys(errors).length) return { ok: false, errors };

    if (UserRepository.findByEmail(data.email))
      return { ok: false, errors: { email: 'Este e-mail já está registado.' } };

    const password_hash = await Utils.hashPassword(data.password);
    const user = UserRepository.create({
      name: data.name.trim(),
      email: data.email.toLowerCase(),
      password_hash,
    });

    ActivityRepository.log(user.id, 'register', 'user', `Conta criada: ${user.email}`);
    return { ok: true, user: { id: user.id, name: user.name, email: user.email } };
  },

  login: async (data) => {
    const errors = Validators.user.login(data);
    if (Object.keys(errors).length) return { ok: false, errors };

    const user = UserRepository.findByEmail(data.email);
    if (!user)
      return { ok: false, errors: { email: 'E-mail não encontrado.' } };

    const hash = await Utils.hashPassword(data.password);
    if (hash !== user.password_hash)
      return { ok: false, errors: { password: 'Palavra-passe incorreta.' } };

    ActivityRepository.log(user.id, 'login', 'user', `Login: ${user.email}`);
    return { ok: true, user: { id: user.id, name: user.name, email: user.email } };
  },
};

export const SubjectService = {
  getAll: (userId) =>
    SubjectRepository.findAll(userId).sort((a, b) => a.name.localeCompare(b.name)),

  getById: (id, userId) => SubjectRepository.findById(id, userId),

  create: (data, userId) => {
    const errors = Validators.subject.create(data, userId);
    if (Object.keys(errors).length) return { ok: false, errors };

    const subject = SubjectRepository.create({
      ...data,
      name: data.name.trim(),
      user_id: userId,
    });
    ActivityRepository.log(userId, 'create', 'subject', `Disciplina criada: ${subject.name}`);
    return { ok: true, subject };
  },

  update: (id, data, userId) => {
    const existing = SubjectRepository.findById(id, userId);
    if (!existing) return { ok: false, errors: { _: 'Disciplina não encontrada.' } };

    const errors = Validators.subject.update(data, userId, id);
    if (Object.keys(errors).length) return { ok: false, errors };

    const subject = SubjectRepository.update(id, { ...data, name: data.name.trim() });
    ActivityRepository.log(userId, 'update', 'subject', `Disciplina atualizada: ${subject.name}`);
    return { ok: true, subject };
  },

  delete: (id, userId) => {
    const existing = SubjectRepository.findById(id, userId);
    if (!existing) return { ok: false, error: 'Disciplina não encontrada.' };

    SubjectRepository.delete(id);

    // Remove subject reference from related tasks and events
    TaskRepository.findAll(userId)
      .filter(t => t.subject_id === id)
      .forEach(t => TaskRepository.update(t.id, { subject_id: null }));

    EventRepository.findAll(userId)
      .filter(e => e.subject_id === id)
      .forEach(e => EventRepository.update(e.id, { subject_id: null }));

    ActivityRepository.log(userId, 'delete', 'subject', `Disciplina eliminada: ${existing.name}`);
    return { ok: true };
  },
};

export const TaskService = {
  getAll: (userId, filters = {}) => {
    let tasks = TaskRepository.findAll(userId);

    if (filters.subject_id) tasks = tasks.filter(t => t.subject_id === filters.subject_id);
    if (filters.status)     tasks = tasks.filter(t => t.status === filters.status);
    if (filters.priority)   tasks = tasks.filter(t => t.priority === filters.priority);
    if (filters.overdue)    tasks = tasks.filter(t => t.status !== 'concluída' && Utils.isOverdue(t.due_date));

    if (filters.search) {
      const query = filters.search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(query) || (t.notes || '').toLowerCase().includes(query)
      );
    }

    const sort = filters.sort || 'due_date';
    tasks.sort((a, b) => {
      if (sort === 'due_date') return (a.due_date || '9999') < (b.due_date || '9999') ? -1 : 1;
      if (sort === 'priority') {
        const order = { alta: 0, média: 1, baixa: 2 };
        return (order[a.priority] ?? 99) - (order[b.priority] ?? 99);
      }
      if (sort === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    return tasks;
  },

  create: (data, userId) => {
    const errors = Validators.task.create(data);
    if (Object.keys(errors).length) return { ok: false, errors };

    const task = TaskRepository.create({ ...data, title: data.title.trim(), user_id: userId });
    ActivityRepository.log(userId, 'create', 'task', `Tarefa criada: ${task.title}`);
    return { ok: true, task };
  },

  patchStatus: (id, status, userId) => {
    const existing = TaskRepository.findById(id, userId);
    if (!existing) return { ok: false };

    const completed_at = status === 'concluída' ? Utils.now() : null;
    const task = TaskRepository.update(id, { status, completed_at });
    ActivityRepository.log(userId, 'status', 'task', `${existing.title} → ${status}`);
    return { ok: true, task };
  },

  delete: (id, userId) => {
    const existing = TaskRepository.findById(id, userId);
    if (!existing) return { ok: false };

    TaskRepository.delete(id);
    ActivityRepository.log(userId, 'delete', 'task', `Tarefa eliminada: ${existing.title}`);
    return { ok: true };
  },
};

export const EventService = {
  getAll: (userId, filters = {}) => {
    let events = EventRepository.findAll(userId);
    if (filters.start)      events = events.filter(e => e.start_date >= filters.start);
    if (filters.end)        events = events.filter(e => e.start_date <= filters.end);
    if (filters.subject_id) events = events.filter(e => e.subject_id === filters.subject_id);
    return events.sort((a, b) => a.start_date.localeCompare(b.start_date));
  },

  create: (data, userId) => {
    const errors = Validators.event.create(data);
    if (Object.keys(errors).length) return { ok: false, errors };

    const event = EventRepository.create({ ...data, title: data.title.trim(), user_id: userId });
    return { ok: true, event };
  },

  delete: (id) => {
    EventRepository.delete(id);
    return { ok: true };
  },
};

export const DashboardService = {
  getSummary: (userId) => {
    const tasks = TaskRepository.findAll(userId);
    const events = EventRepository.findAll(userId);
    const today = Utils.today();
    const in7days = Utils.dateToISO(Utils.addDays(new Date(), 7));

    return {
      total_tasks: tasks.length,
      completed: tasks.filter(t => t.status === 'concluída').length,
      in_progress: tasks.filter(t => t.status === 'em_progresso').length,
      overdue: tasks.filter(t => t.status !== 'concluída' && Utils.isOverdue(t.due_date)).length,
      due_today: tasks.filter(t => t.due_date === today && t.status !== 'concluída').length,
      upcoming_exams: events.filter(e => e.event_type === 'exame' && e.start_date >= today).length,
      tasks_due_soon: tasks
        .filter(t => t.status !== 'concluída' && Utils.isDueSoon(t.due_date))
        .sort((a, b) => (a.due_date || '9999').localeCompare(b.due_date || '9999'))
        .slice(0, 5),
      upcoming_events: events
        .filter(e => e.start_date >= today)
        .sort((a, b) => a.start_date.localeCompare(b.start_date))
        .slice(0, 5),
    };
  },
};
