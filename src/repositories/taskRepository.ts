import { httpClient } from '../api/httpClient';
import type { Task, ApiTodo, TodosResponse } from '../types/task';

function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    category: 'Api',
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
      isLocal: data.id === 255,
    };
  },

  async update(id: number, task: Partial<Task>, isLocal?: boolean) {
    if (isLocal) {
      return { ...task, id } as Task;
    }

    const data = await httpClient.patch<ApiTodo>(`/todos/${id}`, {
      todo: task.title,
      completed: task.completed,
    });

    return {
      ...toTask(data),
      description: task.description || '',
      priority: task.priority || 'medium',
      category: task.category || 'Api',
      isLocal,
    };
  },

  async delete(id: number, isLocal?: boolean) {
    if (isLocal) return { isDeleted: true };
    return await httpClient.delete<{ isDeleted: boolean }>(`/todos/${id}`);
  }
};