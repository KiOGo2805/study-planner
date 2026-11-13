import { useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, deleteTask, setSelectedTaskId } = useTaskContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggle = async () => {
    setIsProcessing(true);
    await toggleTask(task.id);
    setIsProcessing(false);
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteTask(task.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const itemClasses = [
    'task-item',
    task.completed ? 'task-item--completed' : '',
    task.isDeleting ? 'task-item--deleting' : ''
  ].filter(Boolean).join(' ');

  return (
    <li className={itemClasses}>
      <div className="task-item__content">
        <h3 
          className="task-item__title" 
          onClick={() => !task.isDeleting && setSelectedTaskId(task.id)}
          title="Натисніть для перегляду деталей"
        >
          {task.title} 
          {task.isDeleting && (
            <span className="task-item__deleting-label">
              (Видаляється...)
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
          onClick={() => setSelectedTaskId(task.id)} // Тепер це відкриває Деталі, звідки можна правити
          disabled={task.isDeleting || isProcessing}
        >
          Деталі
        </button>
        <button
          className="task-item__btn"
          onClick={handleToggle}
          disabled={task.isDeleting || isProcessing}
        >
          {task.completed ? 'Повернути' : 'Виконати'}
        </button>
        <button
          className="task-item__btn task-item__btn--danger"
          onClick={handleDelete}
          disabled={task.isDeleting || isProcessing}
        >
          Видалити
        </button>
      </div>
    </li>
  );
}