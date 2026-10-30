export function TaskFilters() {
  return (
    <div className="task-filters">
      <button className="task-filters__btn task-filters__btn--active">Всі</button>
      <button className="task-filters__btn">Виконані</button>
      <button className="task-filters__btn">Не виконані</button>
    </div>
  );
}
