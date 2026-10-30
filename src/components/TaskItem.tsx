import { type Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__content">
        <h3 className="task-item__title">{task.title}</h3>
        <p className="task-item__description">{task.description}</p>
        <div className="task-item__badges">
          <span className="task-item__badge">{task.category}</span>
          <span className={`task-item__badge task-item__badge--priority-${task.priority}`}>
            {task.priority}
          </span>
        </div>
      </div>
      <div className="task-item__actions">
        <button className="task-item__btn">
          {task.completed ? 'Повернути' : 'Виконати'}
        </button>
        <button className="task-item__btn task-item__btn--danger">Видалити</button>
      </div>
    </li>
  );
}
