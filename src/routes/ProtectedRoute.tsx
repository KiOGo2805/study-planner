import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import './ProtectedRoute.scss';

interface ProtectedRouteProps {
  children?: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="route-status" role="status">
        Перевірка авторизації...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}