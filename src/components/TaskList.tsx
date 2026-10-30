import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  hasAnyTasks: boolean; // Новий пропс
}

export function TaskList({ tasks, onToggle, onDelete, hasAnyTasks }: TaskListProps) {
  // Якщо завдань взагалі не існує
  if (!hasAnyTasks) {
    return (
      <div className="task-list__empty">
        Завдань поки немає. Додайте перше навчальне завдання.
      </div>
    );
  }

  // Якщо завдання є, але не підходять під поточні фільтри
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