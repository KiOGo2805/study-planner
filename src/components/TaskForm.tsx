import { useState } from 'react';
import type { Priority, Task } from '../types/task';

interface TaskFormProps {
  onAdd: (taskData: Omit<Task, 'id' | 'completed'>) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проста валідація: якщо назва порожня, не дозволяємо додати
    if (!title.trim()) return;

    // Викликаємо функцію з App.tsx
    onAdd({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      priority,
    });

    // Очищаємо форму після додавання
    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__group">
        <input
          type="text"
          placeholder="Назва завдання (обов'язково)"
          className="task-form__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="task-form__group">
        <input
          type="text"
          placeholder="Опис"
          className="task-form__input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="task-form__group">
        <input
          type="text"
          placeholder="Категорія"
          className="task-form__input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="task-form__group">
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
      <button type="submit" className="task-form__submit" disabled={!title.trim()}>
        Додати
      </button>
    </form>
  );
}