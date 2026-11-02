import type { Task } from '../types/task';

const priorityClasses = {
  low: 'bg-priority-low text-priority-low-text',
  medium: 'bg-priority-medium text-priority-medium-text',
  high: 'bg-priority-high text-priority-high-text',
};

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('uk-UA', { 
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <li className={`flex items-start justify-between gap-6 rounded-lg bg-surface p-6 shadow-card transition-[opacity,transform] ${task.completed ? 'opacity-70' : ''}`}>
      <div className="min-w-0 flex-1">
        <h3 className={`mb-2 text-xl font-semibold ${task.completed ? 'text-muted line-through' : 'text-text'}`}>
          {task.title}
        </h3>
        <p className={`mb-4 ${task.completed ? 'text-muted line-through' : 'text-muted'}`}>
          {task.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-xl px-3 py-1 text-xs font-medium ${priorityClasses[task.priority]}`}>
            {task.priority === 'low' ? 'Низький' : task.priority === 'medium' ? 'Середній' : 'Високий'}
          </span>
          <span className="rounded-xl bg-badge px-3 py-1 text-xs font-medium text-badge-text">
            {task.category}
          </span>
        </div>
        
        <div className="mt-3 text-xs text-muted">
          <div>Створено: {formatDate(task.createdAt)}</div>
          {task.completed && task.completedAt && (
            <div>Виконано: {formatDate(task.completedAt)}</div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <button
          className="rounded-md border border-border bg-surface px-4 py-2 font-medium text-text transition-colors hover:bg-hover"
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? 'Повернути' : 'Виконати'}
        </button>
        <button 
          className="rounded-md border border-danger bg-surface px-4 py-2 font-medium text-danger transition-colors hover:bg-danger hover:text-white"
          onClick={() => onDelete(task.id)}
        >
          Видалити
        </button>
      </div>
    </li>
  );
}