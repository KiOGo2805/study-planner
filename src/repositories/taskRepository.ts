import { httpClient, TOKEN_STORAGE_KEY, HttpError } from '../api/httpClient';
import type { Task, ApiTodo, TodosResponse } from '../types/task';

const FALLBACK_CREATED_AT = '2026-01-01T00:00:00.000Z';

export function ensureAuthenticated(): void {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    throw new HttpError(401, 'Необхідна авторизація для виконання цієї дії');
  }
}

function toTask(todo: ApiTodo): Task {
  // DummyJSON does not expose createdBy/createdAt. These fields are client-owned metadata.
  return {
    id: todo.id,
    title: todo.todo,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    category: 'Api',
    createdBy: todo.userId ? `User #${todo.userId}` : 'Unknown',
    createdAt: FALLBACK_CREATED_AT,
  };
}

export const taskRepository = {
  async getAll(limit: number, skip: number, signal?: AbortSignal) {
    const data = await httpClient.get<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, signal);
    return {
      tasks: data.todos.map(toTask),
      total: data.total,
    };
  },

  async getById(id: number, signal?: AbortSignal) {
    const data = await httpClient.get<ApiTodo>(`/todos/${id}`, signal);
    return toTask(data);
  },

  async create(task: Omit<Task, 'id' | 'completed' | 'isDeleting'>) {
    ensureAuthenticated();

    const data = await httpClient.post<ApiTodo>('/todos/add', {
      todo: task.title,
      completed: false,
      userId: 1,
    });

    const uniqueId = data.id === 255 ? Date.now() : data.id;

    return {
      ...toTask(data),
      id: uniqueId,
      description: task.description,
      priority: task.priority,
      category: task.category,
      createdBy: task.createdBy || 'Authorized User',
      createdAt: task.createdAt || new Date().toISOString(),
      isLocal: data.id === 255,
    };
  },

  async update(id: number, task: Partial<Task>, isLocal?: boolean) {
    ensureAuthenticated();

    if (isLocal) {
      return { ...task, id } as Task;
    }

    const data = await httpClient.patch<ApiTodo>(`/todos/${id}`, {
      todo: task.title,
      completed: task.completed,
    });

    return {
      ...toTask(data),
      description: task.description ?? '',
      priority: task.priority ?? 'medium',
      category: task.category ?? 'Api',
      createdBy: task.createdBy ?? `User #${data.userId}`,
      createdAt: task.createdAt ?? FALLBACK_CREATED_AT,
      isLocal,
    };
  },

  async delete(id: number, isLocal?: boolean) {
    ensureAuthenticated();

    if (isLocal) return { isDeleted: true };
    return await httpClient.delete<{ isDeleted: boolean }>(`/todos/${id}`);
  },
};