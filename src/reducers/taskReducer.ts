import type { Task } from '../types/task';

export type TaskAction =
  | { type: 'ADD'; payload: Omit<Task, 'id' | 'completed' | 'isDeleting'> }
  | { type: 'TOGGLE'; payload: number }
  | { type: 'UPDATE'; payload: Task }
  | { type: 'REQUEST_DELETE'; payload: number }
  | { type: 'UNDO_DELETE'; payload: number }
  | { type: 'CONFIRM_DELETE'; payload: number }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'RESET'; payload: Task[] };

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD': {
      const newTask: Task = {
        ...action.payload,
        id: state.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1,
        completed: false,
      };
      return [...state, newTask];
    }
    case 'TOGGLE':
      return state.map(task =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'UPDATE':
      return state.map(task =>
        task.id === action.payload.id ? action.payload : task
      );
    case 'REQUEST_DELETE':
      return state.map(task =>
        task.id === action.payload ? { ...task, isDeleting: true } : task
      );
    case 'UNDO_DELETE':
      return state.map(task =>
        task.id === action.payload ? { ...task, isDeleting: false } : task
      );
    case 'CONFIRM_DELETE':
      return state.filter(task => task.id !== action.payload);
    case 'CLEAR_COMPLETED':
      return state.filter(task => !task.completed);
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
}