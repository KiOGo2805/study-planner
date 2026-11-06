import { useState, useEffect } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Priority } from '../types/task';

interface TaskFormProps {
  existingCategories: string[];
}

export function TaskForm({ existingCategories }: TaskFormProps) {
  const { addTask, updateTask, editingTask, setEditingTask } = useTaskContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'General',
        priority,
      });
      setEditingTask(null);
    } else {
      addTask({
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
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__top-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
        
        <div className="task-form__group" style={{ flex: '1 1 30%' }}>
          <input
            type="text"
            placeholder="Назва завдання (обов'язково)"
            className="task-form__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="task-form__group" style={{ flex: '1 1 30%' }}>
          <input
            type="text"
            list="category-suggestions"
            placeholder="Категорія"
            className="task-form__input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="category-suggestions">
            {existingCategories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        <div className="task-form__group" style={{ flex: '1 1 30%' }}>
          <select
            className="task-form__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>

      <div className="task-form__bottom-row" style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem', alignItems: 'flex-start' }}>
        
        <div className="task-form__group" style={{ flex: '1' }}>
          <textarea
            placeholder="Опис завдання"
            className="task-form__input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="task-form__actions" style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
          <button type="submit" className="task-form__submit" disabled={!title.trim()}>
            {editingTask ? 'Зберегти зміни' : 'Додати'}
          </button>
          {editingTask && (
            <button type="button" className="task-form__btn" onClick={handleCancel}>
              Скасувати
            </button>
          )}
        </div>
      </div>
    </form>
  );
}