import { SubjectRepository } from './db';

export const Validators = {
  user: {
    register: ({ name, email, password }) => {
      const errors = {};
      if (!name?.trim() || name.trim().length < 2)
        errors.name = 'O nome deve ter pelo menos 2 caracteres.';
      if (!email?.includes('@'))
        errors.email = 'E-mail inválido.';
      if (!password || password.length < 6)
        errors.password = 'A palavra-passe deve ter pelo menos 6 caracteres.';
      return errors;
    },

    login: ({ email, password }) => {
      const errors = {};
      if (!email?.includes('@'))
        errors.email = 'E-mail inválido.';
      if (!password)
        errors.password = 'Palavra-passe obrigatória.';
      return errors;
    },
  },

  subject: {
    create: ({ name, color }, userId) => {
      const errors = {};
      if (!name?.trim() || name.trim().length < 2)
        errors.name = 'O nome da disciplina deve ter pelo menos 2 caracteres.';
      if (!color)
        errors.color = 'Seleciona uma cor.';

      const allSubjects = SubjectRepository.findAll(userId);
      const nameExists = allSubjects.some(s => s.name.toLowerCase() === name?.trim().toLowerCase());
      if (nameExists)
        errors.name = 'Já existe uma disciplina com este nome.';

      return errors;
    },

    update: ({ name, color }, userId, excludeId) => {
      const errors = {};
      if (!name?.trim() || name.trim().length < 2)
        errors.name = 'O nome deve ter pelo menos 2 caracteres.';
      if (!color)
        errors.color = 'Seleciona uma cor.';

      const allSubjects = SubjectRepository.findAll(userId);
      const nameExists = allSubjects.some(
        s => s.name.toLowerCase() === name?.trim().toLowerCase() && s.id !== excludeId
      );
      if (nameExists)
        errors.name = 'Já existe uma disciplina com este nome.';

      return errors;
    },
  },

  task: {
    create: ({ title, priority, status, due_date }) => {
      const errors = {};
      if (!title?.trim() || title.trim().length < 2)
        errors.title = 'O título deve ter pelo menos 2 caracteres.';
      if (!['baixa', 'média', 'alta'].includes(priority))
        errors.priority = 'Prioridade inválida.';
      if (!['não_iniciada', 'em_progresso', 'concluída'].includes(status))
        errors.status = 'Estado inválido.';
      if (due_date && !/^\d{4}-\d{2}-\d{2}$/.test(due_date))
        errors.due_date = 'Data inválida.';
      return errors;
    },
  },

  event: {
    create: ({ title, start_date, event_type }) => {
      const errors = {};
      if (!title?.trim() || title.trim().length < 2)
        errors.title = 'O título deve ter pelo menos 2 caracteres.';
      if (!start_date)
        errors.start_date = 'A data de início é obrigatória.';
      if (!['exame', 'prazo', 'estudo', 'personalizado'].includes(event_type))
        errors.event_type = 'Tipo inválido.';
      return errors;
    },
  },
};
