export enum TaskStatus {
  TODO = 'da fare',
  IN_PROGRESS = 'in corso',
  DONE = 'completata',
}

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  deadline?: string
  priority?: string // <--- aggiungi questa riga
}
