export enum TaskStatus {
  TODO = 'da fare',
  IN_PROGRESS = 'in corso',
  DONE = 'completata',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus | 'da fare' | 'in corso' | 'completata';
  deadline?: string;
  date?: string;
  priority?: 'Alta' | 'Media' | 'Bassa';
  link?: string;
}
