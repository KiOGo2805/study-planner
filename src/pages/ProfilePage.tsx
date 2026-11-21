import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <section className="profile-page">
      <div className="profile-page__card">
        <div className="profile-page__header">
          {user?.image && (
            <img
              src={user.image}
              alt={user.username}
              className="profile-page__avatar"
            />
          )}
          <div>
            <h1 className="profile-page__title">
              {user?.firstName} {user?.lastName}
            </h1>
            <span className="profile-page__status">
              {isAuthenticated ? 'Статус: Авторизовано' : 'Статус: Не авторизовано'}
            </span>
          </div>
        </div>

        <dl className="profile-page__info">
          <div className="profile-page__row">
            <dt className="profile-page__label">Username</dt>
            <dd className="profile-page__value">{user?.username}</dd>
          </div>
          <div className="profile-page__row">
            <dt className="profile-page__label">Email</dt>
            <dd className="profile-page__value">{user?.email}</dd>
          </div>
          <div className="profile-page__row">
            <dt className="profile-page__label">User ID</dt>
            <dd className="profile-page__value">#{user?.id}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="profile-page__logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </section>
  );
}