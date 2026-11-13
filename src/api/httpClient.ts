const BASE_URL = import.meta.env.VITE_API_URL;

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!BASE_URL) throw new Error('VITE_API_URL is not defined in .env');
  
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new HttpError(response.status, `Помилка HTTP: ${response.status}`);
  }

  return response.json();
}

export const httpClient = {
  get: <T>(endpoint: string, signal?: AbortSignal) => request<T>(endpoint, { method: 'GET', signal }),
  post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};