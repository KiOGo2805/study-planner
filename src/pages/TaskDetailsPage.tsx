import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { taskRepository } from '../repositories/taskRepository';
import { useTaskContext } from '../hooks/useTaskContext';
import { useAuth } from '../hooks/useAuth';
import { TaskFormDialog } from '../components/TaskFormDialog';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';
import './TaskDetailsPage.scss';

export function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask, toggleTask } = useTaskContext();
  const { isAuthenticated } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const numericTaskId = Number(taskId);
  const invalidTaskId = !Number.isInteger(numericTaskId) || numericTaskId < 1;

  useEffect(() => {
    if (invalidTaskId) return;
    const id = numericTaskId;

    const controller = new AbortController();
    const localTask = tasks.find((item) => item.id === id);
    if (localTask?.isLocal) {
      Promise.resolve(localTask).then((data) => {
        setTask(data);
        setLoading(false);
      });
      return;
    }

    taskRepository.getById(id, controller.signal)
      .then((data) => {
        setError(null);
        setTask(localTask ? { ...data, ...localTask } : data);
      })
      .catch((reason) => {
        if (!(reason instanceof Error && reason.name === 'AbortError')) {
          setError(reason instanceof Error ? reason.message : 'Не вдалося завантажити завдання');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [taskId, tasks, invalidTaskId, numericTaskId]);

  const requireAuth = () => {
    if (isAuthenticated) return true;
    navigate('/login', { state: { from: { pathname: `/tasks/${taskId}` } } });
    return false;
  };

  const handleEdit = async (data: TaskFormData) => {
    if (!task || !requireAuth()) return;
    await updateTask(task.id, data);
  };

  const handleDelete = async () => {
    if (!task || !requireAuth()) return;
    await deleteTask(task.id);
    navigate('/tasks', { replace: true });
  };

  if (invalidTaskId) return <div className="task-details-page task-details-page--error" role="alert">Невірний ідентифікатор завдання</div>;
  if (loading) return <div className="task-details-page" role="status">Завантаження деталей...</div>;
  if (error) return <div className="task-details-page task-details-page--error" role="alert">{error}</div>;
  if (!task) return <div className="task-details-page">Завдання не знайдено.</div>;

  return (
    <article className="task-details-page">
      <button type="button" className="task-details-page__back" onClick={() => navigate('/tasks')}>
        ← До списку
      </button>
      <h1 className="task-details-page__title">{task.title}</h1>
      <p className="task-details-page__description">{task.description || 'Опис відсутній'}</p>
      <dl className="task-details-page__meta">
        <div><dt>Категорія</dt><dd>{task.category}</dd></div>
        <div><dt>Пріоритет</dt><dd>{task.priority}</dd></div>
        <div><dt>Статус</dt><dd>{task.completed ? 'Виконано' : 'В процесі'}</dd></div>
        <div><dt>Створив</dt><dd>{task.createdBy}</dd></div>
        <div><dt>Створено</dt><dd>{new Date(task.createdAt).toLocaleString()}</dd></div>
      </dl>
      {isAuthenticated && (
        <div className="task-details-page__actions">
          <button type="button" onClick={() => void toggleTask(task.id)} className="task-details-page__button">
            {task.completed ? 'Повернути в роботу' : 'Позначити виконаним'}
          </button>
          <button type="button" onClick={() => setEditOpen(true)} className="task-details-page__button">
            Редагувати
          </button>
          <button type="button" onClick={() => void handleDelete()} className="task-details-page__button task-details-page__button--danger">
            Видалити
          </button>
        </div>
      )}
      <TaskFormDialog
        open={editOpen}
        mode="edit"
        task={task}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
      />
    </article>
  );
}