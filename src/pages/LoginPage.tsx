import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate } from 'react-router';
import { loginSchema, type LoginFormData } from '../schemas/authSchema';
import { useAuth } from '../hooks/useAuth';
import { HttpError } from '../api/httpClient';
import './LoginPage.scss';

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
      navigate('/profile', { replace: true });
    } catch (error) {
      if (error instanceof HttpError) {
        setServerError(error.message);
      } else {
        setServerError('Не вдалося виконати вхід. Перевірте підключення до мережі.');
      }
    }
  };

  return (
    <section className="login-page">
      <div className="login-page__card">
        <h1 className="login-page__title">Вхід у Study Planner</h1>

        <form className="login-page__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="login-page__field">
            <label className="login-page__label" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              className={`login-page__input ${errors.username ? 'login-page__input--error' : ''}`}
              aria-invalid={Boolean(errors.username)}
              {...register('username')}
            />
            {errors.username && (
              <span className="login-page__error" role="alert">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="login-page__field">
            <label className="login-page__label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className={`login-page__input ${errors.password ? 'login-page__input--error' : ''}`}
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
            {errors.password && (
              <span className="login-page__error" role="alert">
                {errors.password.message}
              </span>
            )}
          </div>

          {serverError && (
            <div className="login-page__server-error" role="alert">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="login-page__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Виконується вхід...' : 'Увійти'}
          </button>
        </form>

        <p className="login-page__hint">
          Тестові дані DummyJSON: <code>emilys</code> / <code>emilyspass</code>
        </p>
      </div>
    </section>
  );
}