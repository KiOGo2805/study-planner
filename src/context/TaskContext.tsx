import { useCallback, useMemo, useReducer, useEffect, useState, useRef, type ReactNode } from 'react';
import { taskReducer } from '../reducers/taskReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { taskRepository } from '../repositories/taskRepository';
import { TaskContext, type FilterType, type ToastInfo } from './taskContextValue';
import type { TaskContextProps } from './taskContextValue';
import type { Priority, Task } from '../types/task';

const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
const LIMIT = 10;
const DELETE_UNDO_DELAY = 5000;

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [filter, setFilter] = useLocalStorage<FilterType>('study-planner-filter', 'all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortByPriority, setSortByPriority] = useState(false);
  
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingDeleteTimersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  const finalizeDelete = async (id: number, task: Task) => {
    try {
      await taskRepository.delete(id, task.isLocal);
      dispatch({ type: 'CONFIRM_DELETE', payload: id });
      setTotal(prev => Math.max(0, prev - 1));
      showToast('Видалено', 'info');
    } catch (err: unknown) {
      dispatch({ type: 'UNDO_DELETE', payload: id });
      showToast(err instanceof Error ? err.message : 'Помилка видалення', 'error');
    }
  };

  const fetchTasks = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Скасовуємо попередній запит
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const skip = (page - 1) * LIMIT;
      const { tasks: fetchedTasks, total: fetchedTotal } = await taskRepository.getAll(LIMIT, skip, controller.signal);
      dispatch({ type: 'RESET', payload: fetchedTasks });
      setTotal(fetchedTotal);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Не вдалося завантажити завдання');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [page]);

  useEffect(() => {
    fetchTasks();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchTasks]);

  const categories = useMemo(() => Array.from(new Set(tasks.map(t => t.category))), [tasks]);
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === 'completed' && !task.completed) return false;
        if (filter === 'uncompleted' && task.completed) return false;
        if (selectedCategory && task.category !== selectedCategory) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (sortByPriority) return priorityWeight[b.priority] - priorityWeight[a.priority];
        return 0;
      });
  }, [tasks, filter, selectedCategory, sortByPriority]);

  const contextValue: TaskContextProps = {
    tasks, filteredTasks, categories,
    filter, setFilter,
    selectedCategory, setSelectedCategory,
    sortByPriority, setSortByPriority,
    resetFilters: () => { setFilter('all'); setSelectedCategory(''); setSortByPriority(false); },
    
    isLoading, error, fetchTasks,
    page, setPage, totalPages: Math.ceil(total / LIMIT),
    
    addTask: async (payload) => {
      try {
        const newTask = await taskRepository.create(payload);
        dispatch({ type: 'ADD', payload: newTask });
        setTotal(prev => prev + 1); // Оновлюємо загальну кількість сторінок
        showToast('Завдання додано', 'success');
      } catch (err: any) {
        showToast(err.message || 'Помилка створення', 'error');
      }
    },
    updateTask: async (id, patch) => {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      try {
        const updatedTask = await taskRepository.update(id, { ...task, ...patch }, task.isLocal);
        dispatch({ type: 'UPDATE', payload: updatedTask });
        showToast('Оновлено', 'success');
      } catch (err: any) {
        showToast(err.message || 'Помилка оновлення', 'error');
      }
    },
    toggleTask: async (id) => {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      try {
        const updatedTask = await taskRepository.update(id, { ...task, completed: !task.completed }, task.isLocal);
        dispatch({ type: 'TOGGLE', payload: updatedTask });
      } catch (err: any) {
        showToast(err.message || 'Помилка зміни статусу', 'error');
      }
    },
    deleteTask: async (id) => {
      const task = tasks.find(t => t.id === id);
      if (!task || task.isDeleting) return;
      dispatch({ type: 'REQUEST_DELETE', payload: id });
      const timer = setTimeout(() => {
        pendingDeleteTimersRef.current.delete(id);
        void finalizeDelete(id, task);
      }, DELETE_UNDO_DELAY);
      pendingDeleteTimersRef.current.set(id, timer);
    },
    confirmDelete: async (id) => {
      const task = tasks.find(t => t.id === id);
      const timer = pendingDeleteTimersRef.current.get(id);
      if (!task || !timer) return;
      clearTimeout(timer);
      pendingDeleteTimersRef.current.delete(id);
      await finalizeDelete(id, task);
    },
    undoDelete: (id) => {
      const timer = pendingDeleteTimersRef.current.get(id);
      if (!timer) return;
      clearTimeout(timer);
      pendingDeleteTimersRef.current.delete(id);
      dispatch({ type: 'UNDO_DELETE', payload: id });
    },
    
    toast, showToast,
    selectedTaskId, setSelectedTaskId
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => () => {
    pendingDeleteTimersRef.current.forEach(timer => clearTimeout(timer));
    pendingDeleteTimersRef.current.clear();
  }, []);

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
}