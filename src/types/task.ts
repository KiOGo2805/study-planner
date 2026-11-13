export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  isDeleting?: boolean;
  isLocal?: boolean;
}

export type ApiTodo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

export type TodosResponse = {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
};