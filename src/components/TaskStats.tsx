import type { Task } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const uncompleted = total - completed;

  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 rounded-lg bg-surface p-4 shadow-card">
      <span className="font-medium text-text">Всього: {total}</span>
      <span className="font-medium text-text">Виконано: {completed}</span>
      <span className="font-medium text-text">Не виконано: {uncompleted}</span>
    </div>
  );
}