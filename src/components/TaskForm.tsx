import { useState } from 'react';
import type { Priority, Task } from '../types/task';

interface TaskFormProps {
  onAdd: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  existingCategories: string[];
}

export function TaskForm({ onAdd, existingCategories }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      priority,
    });

    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
  };

  return (
    <form className="flex flex-wrap gap-4 rounded-lg bg-surface p-6 shadow-card" onSubmit={handleSubmit}>
      <div className="min-w-[200px] flex-1">
        <input
          type="text"
          placeholder="Назва завдання (обов'язково)"
          className="w-full rounded-md border border-border bg-input p-3 text-text transition-colors placeholder:text-muted focus:border-primary focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="min-w-[200px] flex-1">
        <input
          type="text"
          placeholder="Опис"
          className="w-full rounded-md border border-border bg-input p-3 text-text transition-colors placeholder:text-muted focus:border-primary focus:outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="min-w-[200px] flex-1">
        <input
          type="text"
          list="category-suggestions"
          placeholder="Категорія"
          className="w-full rounded-md border border-border bg-input p-3 text-text transition-colors placeholder:text-muted focus:border-primary focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <datalist id="category-suggestions">
          {existingCategories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
      </div>
      <div className="min-w-[200px] flex-1">
        <select
          className="w-full rounded-md border border-border bg-input p-3 text-text focus:border-primary focus:outline-none"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
      </div>
      <button
        type="submit"
        className="rounded-md bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!title.trim()}
      >
        Додати
      </button>
    </form>
  );
}