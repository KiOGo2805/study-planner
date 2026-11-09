import { useTaskContext } from '../hooks/useTaskContext';

export function Toast() {
  const { toast, tasks, undoDelete } = useTaskContext();
  const deletingTasks = tasks.filter(task => task.isDeleting);

  if (!toast && deletingTasks.length === 0) return null;

  return (
    <div className="toast-container">
      {deletingTasks.map(task => (
        <div key={task.id} className="toast-card toast-card--deleting">
          <div className="toast-card__header">
            <span className="toast-card__title">
              «{task.title}» буде видалено
            </span>
            <button
              className="toast-card__button"
              onClick={() => undoDelete(task.id)}
            >
              Скасувати
            </button>
          </div>
          <div className="toast-card__progress">
            <div className="toast-card__progress-bar" />
          </div>
        </div>
      ))}
      {toast && (
        <div className={`toast-card toast-card--message toast-card--${toast.type}`}>
          {toast?.message}
        </div>
      )}
    </div>
  );
}