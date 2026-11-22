import { useState, useEffect, type ReactNode } from 'react';
import type { User, LoginResponse } from '../types/auth';
import type { LoginFormData } from '../schemas/authSchema';
import {
  httpClient,
  registerUnauthorizedHandler,
  TOKEN_STORAGE_KEY,
} from '../api/httpClient';
import { AuthContext } from './authContextValue';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  );
  const [isLoading, setIsLoading] = useState<boolean>(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))
  );

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const controller = new AbortController();

    async function fetchCurrentUser() {
      try {
        const currentUser = await httpClient.get<User>('/auth/me', controller.signal);
        setUser(currentUser);
      } catch {
        if (!controller.signal.aborted) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchCurrentUser();

    return () => controller.abort();
  }, [accessToken]);
  
  useEffect(
    () =>
      registerUnauthorizedHandler(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAccessToken(null);
        setUser(null);
        setIsLoading(false);
      }),
    []
  );

  const login = async (credentials: LoginFormData) => {
    const response = await httpClient.post<LoginResponse>('/auth/login', credentials);

    localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
    setAccessToken(response.accessToken);
    setIsLoading(false);
    setUser({
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      image: response.image,
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(user && accessToken),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}