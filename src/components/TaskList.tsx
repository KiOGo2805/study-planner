import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import './TaskList.scss';
import type { Task } from '../types/task';

export function TaskList({ filteredTasks }: { filteredTasks: Task[] }) {
  const { 
    tasks, 
    isLoading, 
    error, 
    fetchTasks, 
    page, 
    setPage, 
    totalPages 
  } = useTaskContext();

  if (isLoading) {
    return <div className="state-message">Завантаження завдань...</div>;
  }

  if (error) {
    return (
      <div className="state-message state-message--error">
        <p>{error}</p>
        <button onClick={fetchTasks} className="task-item__btn">Спробувати ще</button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        Завдань поки немає. Додайте перше навчальне завдання.
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="task-list__empty">
        За цим фільтром завдань немає.
      </div>
    );
  }

  return (
    <>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

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