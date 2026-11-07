import { useTaskContext } from '../hooks/useTaskContext';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, requestDelete, undoDelete, setEditingTask } = useTaskContext();

  const itemClasses = [
    'task-item',
    task.completed ? 'task-item--completed' : '',
    task.isDeleting ? 'task-item--deleting' : ''
  ].filter(Boolean).join(' ');

  return (
    <li className={itemClasses}>
      <div className="task-item__content">
        <h3 className="task-item__title">
          {task.title} 
          {task.isDeleting && (
            <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              (Буде видалено...)
            </span>
          )}
        </h3>
        <p className="task-item__description">{task.description}</p>
        <div className="task-item__badges">
          <span className={`task-item__badge task-item__badge--priority-${task.priority}`}>
            {task.priority === 'high' ? 'Високий' : task.priority === 'medium' ? 'Середній' : 'Низький'}
          </span>
          <span className="task-item__badge">{task.category}</span>
        </div>
      </div>
      
      <div className="task-item__actions">
        <button 
          className="task-item__btn" 
          onClick={() => setEditingTask(task)}
          disabled={task.isDeleting}
        >
          Редагувати
        </button>
        <button 
          className="task-item__btn" 
          onClick={() => toggleTask(task.id)}
          disabled={task.isDeleting}
        >
          {task.completed ? 'Повернути' : 'Виконати'}
        </button>
        <button 
          className={`task-item__btn${task.isDeleting ? ' task-item__btn--undo' : ' task-item__btn--danger'}`}
          onClick={() => task.isDeleting ? undoDelete(task.id) : requestDelete(task.id)}
        >
          {task.isDeleting ? 'Скасувати' : 'Видалити'}
        </button>
      </div>
    </li>
  );
}