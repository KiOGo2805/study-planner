import { useEffect, useState, useRef } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';
import { TaskForm } from './TaskForm';

export function TaskDetails() {
  const {
    selectedTaskId,
    setSelectedTaskId,
    tasks,
    toggleTask,
    deleteTask,
  } = useTaskContext();
  const [taskDetails, setTaskDetails] = useState<{ id: number; task: Task } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const localTask = tasks.find(t => t.id === selectedTaskId);
  const fetchedTask = taskDetails?.id === selectedTaskId ? taskDetails.task : null;
  const displayedTaskDetails = localTask
    ? { ...fetchedTask, ...localTask }
    : fetchedTask;

  const closeModal = () => {
    setIsEditing(false);
    setSelectedTaskId(null);
  };

  useEffect(() => {
    if (!selectedTaskId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setSelectedTaskId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskId, setSelectedTaskId]);

  useEffect(() => {
    if (!selectedTaskId) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [selectedTaskId]);

  useEffect(() => {
    if (!selectedTaskId) return;

    const task = tasks.find(t => t.id === selectedTaskId);
    if (task?.isLocal) return;

    const fetchDetails = async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const data = await taskRepository.getById(selectedTaskId, controller.signal);
        // Мерджимо серверні дані (completed, title) з локальними (description, priority)
        setTaskDetails({ id: selectedTaskId, task: { ...data, ...task } });
      } catch (err: unknown) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
          setError(err instanceof Error ? err.message : 'Помилка завантаження деталей');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchDetails();

    return () => abortRef.current?.abort();
  }, [selectedTaskId, tasks, retryCount]);

  if (!selectedTaskId) return null;

  return (
    <div className="task-details-overlay" onClick={closeModal}>
      <section
        className="task-details"
        role="dialog"
        aria-modal="true"
        aria-label="Деталі завдання"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className="task-details__close"
          onClick={closeModal}
          aria-label="Закрити деталі"
        >
          &times;
        </button>
        
        {loading && <p>Завантаження деталей...</p>}
        {error && (
          <div className="state-message state-message--error">
            <p>{error}</p>
            <button onClick={() => setRetryCount(count => count + 1)} className="task-item__btn">Спробувати ще</button>
          </div>
        )}
        
        {!loading && !error && displayedTaskDetails && (
          isEditing ? (
            <>
              <h2 className="task-details__title" id="task-details-title">Редагувати завдання</h2>
              <TaskForm
                editingTask={displayedTaskDetails}
                onCancel={() => setIsEditing(false)}
              />
            </>
          ) : (
            <>
              <h2 className="task-details__title" id="task-details-title">{displayedTaskDetails.title}</h2>
              <div className="task-details__badges">
                <span className="task-item__badge">{displayedTaskDetails.category}</span>
                <span className={`task-item__badge task-item__badge--priority-${displayedTaskDetails.priority}`}>
                  {displayedTaskDetails.priority === 'high'
                    ? 'Високий'
                    : displayedTaskDetails.priority === 'medium' ? 'Середній' : 'Низький'}
                </span>
                <span className="task-item__badge">
                  {displayedTaskDetails.completed ? 'Виконано' : 'В процесі'}
                </span>
              </div>
              <p className="task-details__desc">
                {displayedTaskDetails.description || 'Опис відсутній'}
              </p>
              <div className="task-details__actions">
                <button
                  type="button"
                  className="task-item__btn task-details__action"
                  disabled={displayedTaskDetails.isDeleting || isProcessing}
                  onClick={async () => {
                    setIsProcessing(true);
                    try {
                      await toggleTask(selectedTaskId);
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                >
                  {displayedTaskDetails.completed ? 'Повернути в роботу' : 'Виконати'}
                </button>
                <button
                  type="button"
                  className="task-item__btn task-details__action"
                  disabled={displayedTaskDetails.isDeleting || isProcessing}
                  onClick={() => setIsEditing(true)}
                >
                  Редагувати
                </button>
                <button
                  type="button"
                  className="task-item__btn task-item__btn--danger task-details__action"
                  disabled={displayedTaskDetails.isDeleting || isProcessing}
                  onClick={() => {
                    void deleteTask(selectedTaskId);
                    closeModal();
                  }}
                >
                  Видалити
                </button>
              </div>
            </>
          )
        )}
      </section>
    </div>
  );
}