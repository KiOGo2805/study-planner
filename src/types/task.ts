export type Priority = 'low' | 'medium' | 'high';

// DummyJSON does not expose createdBy/createdAt. These fields are client-owned metadata.
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  isDeleting?: boolean;
  isLocal?: boolean;
  createdBy: string;
  createdAt: string;
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