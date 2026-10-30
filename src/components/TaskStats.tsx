import type { Task } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const uncompleted = total - completed;

  return (
    <div className="task-stats">
      <span className="task-stats__item">Всього: {total}</span>
      <span className="task-stats__item">Виконано: {completed}</span>
      <span className="task-stats__item">Не виконано: {uncompleted}</span>
    </div>
  );
}