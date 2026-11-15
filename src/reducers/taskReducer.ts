import type { Task } from '../types/task';

export type TaskAction =
  | { type: 'ADD'; payload: Task }
  | { type: 'TOGGLE'; payload: Task }
  | { type: 'UPDATE'; payload: Task }
  | { type: 'REQUEST_DELETE'; payload: number }
  | { type: 'UNDO_DELETE'; payload: number }
  | { type: 'CONFIRM_DELETE'; payload: number }
  | { type: 'RESET'; payload: Task[] };

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state].slice(0, 10);
    case 'TOGGLE':
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
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
}