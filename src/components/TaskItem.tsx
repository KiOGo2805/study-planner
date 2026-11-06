import { useTaskContext } from '../hooks/useTaskContext';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, confirmDelete } = useTaskContext();
    return (
      <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
        <div className="task-item__content">
        <h3 className="task-item__title">{task.title}</h3>
        <p className="task-item__description">{task.description}</p>
        <div className="task-item__badges">
          <span className={`task-item__badge task-item__badge--priority-${task.priority}`}>
            {task.priority === 'high' ? 'Високий' : task.priority === 'medium' ? 'Середній' : 'Низький'}
          </span>
          <span className="task-item__badge">{task.category}</span>
        </div>
      </div>
      
      <div className="task-item__actions">
        <button className="task-item__btn" onClick={() => toggleTask(task.id)}>
          {task.completed ? 'Повернути' : 'Виконати'}
        </button>
        <button 
          className="task-item__btn task-item__btn--danger" 
          onClick={() => confirmDelete(task.id)}
        >
          Видалити
        </button>
      </div>
    </li>
  );
}