import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import './AppLayout.scss';

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/tasks', { replace: true });
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'header__link header__link--active' : 'header__link';

  return (
    <div className="app-layout">
      <header className="header">
        <NavLink to="/tasks" className="header__brand">
          <h1 className="header__title">Study Planner</h1>
        </NavLink>

        <div className="header__controls">
          <nav className="header__nav" aria-label="Головна навігація">
            <NavLink to="/tasks" className={getNavLinkClass}>
              Завдання
            </NavLink>
            <NavLink to="/profile" className={getNavLinkClass}>
              Профіль
            </NavLink>
          </nav>

          <button
            type="button"
            className="header__theme-toggle"
            onClick={toggleTheme}
            aria-label="Перемкнути тему"
          >
            {isDarkTheme ? 'Світла тема' : 'Темна тема'}
          </button>

          {isAuthenticated ? (
            <div className="header__session">
              <span className="header__username">{user?.username}</span>
              <button
                type="button"
                className="header__auth-btn header__auth-btn--logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="header__auth-btn">
              Login
            </NavLink>
          )}
        </div>
      </header>

      <main className="app-layout__main">
        <Outlet />
      </main>
    </div>
  );
}