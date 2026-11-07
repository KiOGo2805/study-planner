import { useCallback, useMemo, useReducer, useEffect, useRef, useState, type ReactNode } from 'react';
import { taskReducer } from '../reducers/taskReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Priority, Task } from '../types/task';
import { initialTasks } from '../data/initialTasks';
import { TaskContext, type FilterType, type ToastInfo } from './taskContextValue';
import type { TaskContextProps } from './taskContextValue';

const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

const withoutPendingDelete = (task: Task): Task => {
  const persistedTask = { ...task };
  delete persistedTask.isDeleting;
  return persistedTask;
};

const initTasks = (): Task[] => {
  try {
    const item = localStorage.getItem('study-planner-tasks');
    return item
      ? (JSON.parse(item) as Task[]).map(withoutPendingDelete)
      : initialTasks;
  } catch (error) {
    console.error('Помилка читання завдань:', error);
    return initialTasks;
  }
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, [], initTasks);
  const deleteTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const [filter, setFilter] = useLocalStorage<FilterType>('study-planner-filter', 'all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortByPriority, setSortByPriority] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(tasks.map(task => task.category))),
    [tasks],
  );
  const filteredTasks = useMemo(() => {
    const visibleTasks = tasks.filter((task) => {
      if (filter === 'completed' && !task.completed) return false;
      if (filter === 'uncompleted' && task.completed) return false;
      if (selectedCategory && task.category !== selectedCategory) return false;
      return true;
    });

    return visibleTasks.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (sortByPriority) {
        const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
      }
      return 0;
    });
  }, [tasks, filter, selectedCategory, sortByPriority]);

  useEffect(() => {
    try {
      const persistedTasks = tasks.map(withoutPendingDelete);
      localStorage.setItem('study-planner-tasks', JSON.stringify(persistedTasks));
    } catch (error) {
      console.error('Помилка збереження завдань:', error);
    }
  }, [tasks]);

  const resetFilters = () => {
    setFilter('all');
    setSelectedCategory('');
    setSortByPriority(false);
  };

  const contextValue: TaskContextProps = {
    tasks,
    filteredTasks,
    categories,
    filter,
    setFilter,
    selectedCategory,
    setSelectedCategory,
    sortByPriority,
    setSortByPriority,
    resetFilters,
    addTask: (payload) => {
      if (!payload.title.trim()) {
        showToast('Назва завдання не може бути порожньою', 'error');
        return;
      }
      dispatch({ type: 'ADD', payload });
      showToast('Завдання додано', 'success');
    },
    updateTask: (payload) => {
      if (!tasks.some(task => task.id === payload.id)) {
        showToast('Не вдалося знайти завдання для редагування', 'error');
        return;
      }
      if (!payload.title.trim()) {
        showToast('Назва завдання не може бути порожньою', 'error');
        return;
      }
      dispatch({ type: 'UPDATE', payload });
      showToast('Завдання оновлено', 'success');
    },
    toggleTask: (payload) => {
      const task = tasks.find(item => item.id === payload);
      if (!task || task.isDeleting) {
        showToast('Не вдалося змінити стан завдання', 'error');
        return;
      }
      dispatch({ type: 'TOGGLE', payload });
    },
    requestDelete: (payload) => {
      const task = tasks.find(item => item.id === payload);
      if (!task) {
        showToast('Не вдалося знайти завдання для видалення', 'error');
        return;
      }
      if (task.isDeleting) {
        showToast('Це завдання вже очікує на видалення', 'error');
        return;
      }
      dispatch({ type: 'REQUEST_DELETE', payload });
    },
    confirmDelete: (payload) => dispatch({ type: 'CONFIRM_DELETE', payload }),
    undoDelete: (payload) => {
      const task = tasks.find(item => item.id === payload);
      if (!task?.isDeleting) {
        showToast('Немає запланованого видалення для скасування', 'error');
        return;
      }
      dispatch({ type: 'UNDO_DELETE', payload });
    },
    clearCompleted: () => { dispatch({ type: 'CLEAR_COMPLETED' }); showToast('Виконані завдання очищено', 'info'); },
    resetTasks: () => { dispatch({ type: 'RESET', payload: initialTasks }); showToast('Дані скинуто', 'info'); },
    toast,
    showToast,
    editingTask,
    setEditingTask,
  };

  useEffect(() => {
    const pendingTasks = tasks.filter(task => task.isDeleting);
    const pendingIds = new Set(pendingTasks.map(task => task.id));

    for (const [taskId, timer] of deleteTimers.current) {
      if (!pendingIds.has(taskId)) {
        clearTimeout(timer);
        deleteTimers.current.delete(taskId);
      }
    }

    for (const task of pendingTasks) {
      if (deleteTimers.current.has(task.id)) continue;

      const timer = setTimeout(() => {
        deleteTimers.current.delete(task.id);
        dispatch({ type: 'CONFIRM_DELETE', payload: task.id });
        showToast(`Завдання «${task.title}» видалено`, 'info');
      }, 5000);
      deleteTimers.current.set(task.id, timer);
    }
  }, [tasks, showToast]);

  useEffect(() => () => {
    for (const timer of deleteTimers.current.values()) {
      clearTimeout(timer);
    }
    deleteTimers.current.clear();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}