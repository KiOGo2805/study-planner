import { useTaskContext } from '../hooks/useTaskContext';

export function TaskStats() {
  const { tasks } = useTaskContext();
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const uncompletedCount = totalCount - completedCount;

  return (
    <div className="task-stats">
      <span className="task-stats__item">На сторінці: {totalCount}</span>
      <span className="task-stats__item">Виконано: {completedCount}</span>
      <span className="task-stats__item">Не виконано: {uncompletedCount}</span>
    </div>
  );
}