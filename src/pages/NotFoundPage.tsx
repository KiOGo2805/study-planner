import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="not-found">
      <h1 className="not-found__title">404 — Сторінку не знайдено</h1>
      <p className="not-found__text">Запитаний маршрут не існує.</p>
      <Link to="/tasks" className="not-found__link">
        Повернутися до завдань
      </Link>
    </section>
  );
}