import { useEffect, useState, useRef } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

export function TaskDetails() {
  const { selectedTaskId, setSelectedTaskId, tasks } = useTaskContext();
  const [taskDetails, setTaskDetails] = useState<{ id: number; task: Task } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const localTask = tasks.find(t => t.id === selectedTaskId);
  const displayedTaskDetails = localTask?.isLocal
    ? localTask
    : taskDetails?.id === selectedTaskId ? taskDetails.task : null;

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
    <div className="task-details-overlay" onClick={() => setSelectedTaskId(null)}>
      <div className="task-details" onClick={e => e.stopPropagation()}>
        <button className="task-details__close" onClick={() => setSelectedTaskId(null)}>&times;</button>
        
        {loading && <p>Завантаження деталей...</p>}
        {error && (
          <div className="state-message state-message--error">
            <p>{error}</p>
            <button onClick={() => setRetryCount(count => count + 1)} className="task-item__btn">Спробувати ще</button>
          </div>
        )}
        
        {!loading && !error && displayedTaskDetails && (
          <>
            <h2 className="task-details__title">{displayedTaskDetails.title}</h2>
            <div className="task-details__badges">
              <span className="task-item__badge">{displayedTaskDetails.category}</span>
              <span className={`task-item__badge task-item__badge--priority-${displayedTaskDetails.priority}`}>
                {displayedTaskDetails.priority}
              </span>
              <span className="task-item__badge">
                {displayedTaskDetails.completed ? 'Виконано' : 'В процесі'}
              </span>
            </div>
            <p className="task-details__desc">
              {displayedTaskDetails.description || 'Опис відсутній'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}