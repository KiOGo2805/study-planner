import { createContext } from 'react';
import type { Task } from '../types/task';

export type FilterType = 'all' | 'completed' | 'uncompleted';
export type ToastType = 'success' | 'error' | 'info';
export interface ToastInfo { message: string; type: ToastType; }

export interface TaskContextProps {
  tasks: Task[];
  filteredTasks: Task[];
  categories: string[];
  
  filter: FilterType; setFilter: (f: FilterType) => void;
  selectedCategory: string; setSelectedCategory: (c: string) => void;
  sortByPriority: boolean; setSortByPriority: (s: boolean) => void;
  resetFilters: () => void;

  // Server state
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;

  // Async actions
  addTask: (task: Omit<Task, 'id' | 'completed' | 'isDeleting' | 'isLocal'>) => Promise<void>;
  updateTask: (id: number, patch: Partial<Task>) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  confirmDelete: (id: number) => Promise<void>;
  undoDelete: (id: number) => void;

  // UI state
  toast: ToastInfo | null;
  showToast: (message: string, type?: ToastType) => void;
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;
}

export const TaskContext = createContext<TaskContextProps | undefined>(undefined);