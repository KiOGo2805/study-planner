import { useReducer, useEffect, useState, type ReactNode } from 'react';
import { taskReducer } from '../reducers/taskReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Task } from '../types/task';
import { initialTasks } from '../data/initialTasks';
import { TaskContext, type FilterType, type ToastInfo } from './taskContextValue';
import type { TaskContextProps } from './taskContextValue';

const initTasks = (): Task[] => {
  try {
    const item = window.localStorage.getItem('study-planner-tasks');
    return item ? JSON.parse(item) : initialTasks;
  } catch (error) {
    console.error('Помилка читання завдань:', error);
    return initialTasks;
  }
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, [], initTasks);
  const [filter, setFilter] = useLocalStorage<FilterType>('study-planner-filter', 'all');
  const [toast, setToast] = useState<ToastInfo | null>(null);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    window.localStorage.setItem('study-planner-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const contextValue: TaskContextProps = {
    tasks,
    filter,
    setFilter,
    addTask: (payload) => { dispatch({ type: 'ADD', payload }); showToast('Завдання додано', 'success'); },
    updateTask: (payload) => { dispatch({ type: 'UPDATE', payload }); showToast('Завдання оновлено', 'success'); },
    toggleTask: (payload) => dispatch({ type: 'TOGGLE', payload }),
    requestDelete: (payload) => dispatch({ type: 'REQUEST_DELETE', payload }),
    confirmDelete: (payload) => dispatch({ type: 'CONFIRM_DELETE', payload }),
    undoDelete: (payload) => dispatch({ type: 'UNDO_DELETE', payload }),
    clearCompleted: () => { dispatch({ type: 'CLEAR_COMPLETED' }); showToast('Виконані завдання очищено', 'info'); },
    resetTasks: () => { dispatch({ type: 'RESET', payload: initialTasks }); showToast('Дані скинуто', 'info'); },
    toast,
    showToast,
    editingTask,
    setEditingTask,
  };

  const deletingTask = tasks.find(t => t.isDeleting);

  useEffect(() => {
    if (deletingTask) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CONFIRM_DELETE', payload: deletingTask.id });
        showToast('Завдання остаточно видалено', 'info');
      }, 5000);
      
      return () => clearTimeout(timer); 
    }
  }, [deletingTask]);

  useEffect(() => {
    if (toast && !deletingTask) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, deletingTask]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}