import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';

export function TaskList() {
  const { 
    tasks, 
    filteredTasks, 
    isLoading, 
    error, 
    fetchTasks, 
    page, 
    setPage, 
    totalPages 
  } = useTaskContext();

  // 1. Стан завантаження
  if (isLoading) {
    return <div className="state-message">Завантаження завдань...</div>;
  }

  // 2. Стан помилки з можливістю повторити запит (вимога лаби)
  if (error) {
    return (
      <div className="state-message state-message--error">
        <p>{error}</p>
        <button onClick={fetchTasks} className="task-item__btn">Спробувати ще</button>
      </div>
    );
  }

  // 3. Повністю порожній список (збережено твій текст)
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        Завдань поки немає. Додайте перше навчальне завдання.
      </div>
    );
  }

  // 4. Порожній список після фільтрації (збережено твій текст)
  if (filteredTasks.length === 0) {
    return (
      <div className="task-list__empty">
        За цим фільтром завдань немає.
      </div>
    );
  }

  // 5. Успішний рендер списку з пагінацією
  return (
    <>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

      {/* Пагінація відображається тільки якщо сторінок більше 1 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination__btn" 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
          >
            Попередня
          </button>
          <span className="pagination__info">Сторінка {page} з {totalPages}</span>
          <button 
            className="pagination__btn" 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
          >
            Наступна
          </button>
        </div>
      )}
    </>
  );
}