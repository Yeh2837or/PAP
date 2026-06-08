export const STORAGE_KEY = "studenthelper_v1";
export const SESSION_KEY = "sh_session";

export const COLORS = {
  primary: '#3B5BDB',
  success: '#2B8A3E',
  danger: '#C92A2A',
  warning: '#E67700',
  info: '#1971C2',
  text: '#1A1B1E',
  textMuted: '#6B7280',
};

export const SUBJECT_COLORS = [
  { value: '#3B5BDB', label: 'Azul' },
  { value: '#2B8A3E', label: 'Verde' },
  { value: '#C92A2A', label: 'Vermelho' },
  { value: '#862E9C', label: 'Roxo' },
  { value: '#E67700', label: 'Laranja' },
  { value: '#1971C2', label: 'Azul-claro' },
  { value: '#087F5B', label: 'Verde-escuro' },
  { value: '#A61E4D', label: 'Rosa' },
  { value: '#5C3500', label: 'Castanho' },
  { value: '#343A40', label: 'Cinzento' },
];

export const PRIORITY_CONFIG = {
  alta:  { label: 'Alta',  color: COLORS.danger,  bg: '#FFF5F5', icon: '‚¨Ü' },
  m√©dia: { label: 'M√©dia', color: COLORS.warning, bg: '#FFF3BF', icon: '‚û°' },
  baixa: { label: 'Baixa', color: COLORS.success, bg: '#EBFBEE', icon: '‚¨á' },
};

export const STATUS_CONFIG = {
  n√£o_iniciada: { label: 'N√£o Iniciada', color: COLORS.textMuted, bg: '#F3F4F6', icon: '‚óã' },
  em_progresso: { label: 'Em Progresso', color: COLORS.info,     bg: '#E7F5FF', icon: '‚óë' },
  conclu√≠da:    { label: 'Conclu√≠da',    color: COLORS.success,   bg: '#EBFBEE', icon: '‚óè' },
};

export const EVENT_TYPE_CONFIG = {
  exame:         { label: 'Exame',            color: '#C92A2A', bg: '#FFF5F5', icon: 'Ì≥ù' },
  prazo:         { label: 'Prazo',            color: '#E67700', bg: '#FFF3BF', icon: 'Ì≥ã' },
  estudo:        { label: 'Sess√£o de Estudo', color: '#1971C2', bg: '#E7F5FF', icon: 'Ì≥ö' },
  personalizado: { label: 'Personalizado',    color: '#862E9C', bg: '#F8F0FC', icon: 'ÔøΩÔøΩ' },
};
