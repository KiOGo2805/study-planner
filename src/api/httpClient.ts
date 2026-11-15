import axios, { type AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      throw new HttpError(error.response.status, `Помилка HTTP: ${error.response.status}`);
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
