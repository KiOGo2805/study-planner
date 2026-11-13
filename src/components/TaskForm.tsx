import { useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Priority, Task } from '../types/task';

interface TaskFormProps {
  editingTask?: Task;
  onCancel?: () => void;
}

export function TaskForm({ editingTask, onCancel }: TaskFormProps) {
  return (
    <TaskFormFields
      key={editingTask ? `edit-${editingTask.id}` : 'new'}
      editingTask={editingTask ?? null}
      onCancel={onCancel}
    />
  );
}

interface TaskFormFieldsProps {
  editingTask: Task | null;
  onCancel?: () => void;
}

function TaskFormFields({ editingTask, onCancel }: TaskFormFieldsProps) {
  const { categories, addTask, updateTask } = useTaskContext();

  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [category, setCategory] = useState(editingTask?.category ?? '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    if (editingTask) {
      await updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'General',
        priority,
      });
      onCancel?.();
    } else {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'General',
        priority,
      });
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
    }
    
    setIsSubmitting(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__top-row">
        
        <div className="task-form__group">
          <input
            type="text"
            placeholder="Назва завдання (обов'язково)"
            className="task-form__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="task-form__group">
          <input
            type="text"
            list={`category-suggestions-${editingTask?.id ?? 'new'}`}
            placeholder="Категорія"
            className="task-form__input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          />
          <datalist id={`category-suggestions-${editingTask?.id ?? 'new'}`}>
            {categories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        <div className="task-form__group">
          <select
            className="task-form__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            disabled={isSubmitting}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>

      <div className="task-form__bottom-row">
        
        <div className="task-form__group">
          <textarea
            placeholder="Опис завдання"
            className="task-form__input task-form__description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            disabled={isSubmitting}
          />
        </div>

        <div className="task-form__actions">
          <button type="submit" className="task-form__submit" disabled={!title.trim() || isSubmitting}>
            {isSubmitting ? 'Збереження...' : (editingTask ? 'Зберегти зміни' : 'Додати')}
          </button>
          {editingTask && (
            <button type="button" className="task-item__btn" onClick={onCancel} disabled={isSubmitting}>
              Скасувати
            </button>
          )}
        </div>
      </div>
    </form>
  );
}