import { useEffect, useState, useRef } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

export function TaskDetails() {
  const { selectedTaskId, setSelectedTaskId, tasks } = useTaskContext();
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!selectedTaskId) return;

    const localTask = tasks.find(t => t.id === selectedTaskId);
    if (localTask?.isLocal) {
      setTaskDetails(localTask);
      return;
    }

    const fetchDetails = async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const data = await taskRepository.getById(selectedTaskId, controller.signal);
        // Мерджимо серверні дані (completed, title) з локальними (description, priority)
        setTaskDetails({ ...data, ...localTask });
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err.message || 'Помилка завантаження деталей');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchDetails();

    return () => abortRef.current?.abort();
  }, [selectedTaskId, tasks]);

  if (!selectedTaskId) return null;

  return (
    <div className="task-details-overlay" onClick={() => setSelectedTaskId(null)}>
      <div className="task-details" onClick={e => e.stopPropagation()}>
        <button className="task-details__close" onClick={() => setSelectedTaskId(null)}>&times;</button>
        
        {loading && <p>Завантаження деталей...</p>}
        {error && (
          <div className="state-message state-message--error">
            <p>{error}</p>
            <button onClick={() => setSelectedTaskId(selectedTaskId)} className="task-item__btn">Спробувати ще</button>
          </div>
        )}
        
        {!loading && !error && taskDetails && (
          <>
            <h2 className="task-details__title">{taskDetails.title}</h2>
            <div className="task-details__badges">
              <span className="task-item__badge">{taskDetails.category}</span>
              <span className={`task-item__badge task-item__badge--priority-${taskDetails.priority}`}>
                {taskDetails.priority}
              </span>
              <span className="task-item__badge">
                {taskDetails.completed ? 'Виконано' : 'В процесі'}
              </span>
            </div>
            <p className="task-details__desc">
              {taskDetails.description || 'Опис відсутній'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}