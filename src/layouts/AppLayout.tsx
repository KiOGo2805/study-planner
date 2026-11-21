import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'app-layout__link app-layout__link--active' : 'app-layout__link';

  return (
    <div className="app-layout">
      <header className="app-layout__header">
        <div className="app-layout__header-inner">
          <NavLink to="/tasks" className="app-layout__brand">
            Study Planner
          </NavLink>

          <nav className="app-layout__nav" aria-label="Головна навігація">
            <NavLink to="/tasks" className={getNavLinkClass}>
              Tasks
            </NavLink>
            <NavLink to="/profile" className={getNavLinkClass}>
              Profile
            </NavLink>
          </nav>

          <div className="app-layout__controls">
            <button
              type="button"
              className="app-layout__theme-btn"
              onClick={toggleTheme}
              aria-label="Перемкнути тему"
            >
            </button>

            {isAuthenticated ? (
              <div className="app-layout__session">
                <span className="app-layout__username">{user?.username}</span>
                <button
                  type="button"
                  className="app-layout__auth-btn app-layout__auth-btn--logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="app-layout__auth-btn">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="app-layout__main">
        <Outlet />
      </main>
    </div>
  );
}