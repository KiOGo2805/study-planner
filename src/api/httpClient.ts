import axios, { type AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
export const TOKEN_STORAGE_KEY = 'study_planner_token';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let unauthorizedHandler: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: () => void): () => void {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
}

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  if (!BASE_URL) throw new Error('VITE_API_URL is not defined in .env');

  try {
    const response = await client.request<T>(config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const serverMessage =
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data
          ? String(error.response.data.message)
          : `Помилка HTTP: ${error.response.status}`;

      throw new HttpError(error.response.status, serverMessage);
    }

    throw error;
  }
}

export const httpClient = {
  get: <T>(endpoint: string, signal?: AbortSignal) =>
    request<T>({ url: endpoint, method: 'GET', signal }),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>({ url: endpoint, method: 'POST', data: body }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>({ url: endpoint, method: 'PATCH', data: body }),
  delete: <T>(endpoint: string) =>
    request<T>({ url: endpoint, method: 'DELETE' }),
};