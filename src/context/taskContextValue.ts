import { createContext } from 'react';
import type { Task } from '../types/task';

export type FilterType = 'all' | 'completed' | 'uncompleted';

export interface ToastInfo {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface TaskContextProps {
  tasks: Task[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  addTask: (taskData: Omit<Task, 'id' | 'completed' | 'isDeleting'>) => void;
  updateTask: (task: Task) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  confirmDelete: (id: number) => void;
  undoDelete: (id: number) => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}

export const TaskContext = createContext<TaskContextProps | undefined>(undefined);
