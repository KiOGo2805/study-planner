import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import type { FilterType } from '../App';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  currentFilter: FilterType;
}

export function TaskList({ tasks, onToggle, onDelete, currentFilter }: TaskListProps) {
  // Якщо масив порожній і обрано фільтр "Всі" (або завдань ще не створювали)
  if (tasks.length === 0 && currentFilter === 'all') {
    return (
      <div className="task-list__empty">
        Завдань поки немає. Додайте перше навчальне завдання.
      </div>
    );
  }

  // Якщо масив порожній, але обрано специфічний фільтр
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        За цим фільтром завдань немає.
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggle={onToggle} 
          onDelete={onDelete} 
        />
      ))}
    </ul>
  );
}