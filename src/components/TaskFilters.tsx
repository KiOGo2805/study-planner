import type { FilterType } from '../App';
import type { Task } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  tasks: Task[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortByPriority: boolean;
  onSortChange: (sort: boolean) => void;
  onResetFilters: () => void;
}

export function TaskFilters({ 
  currentFilter, onFilterChange, tasks, 
  categories, selectedCategory, onCategoryChange,
  sortByPriority, onSortChange, onResetFilters
}: TaskFiltersProps) {
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const uncompletedCount = totalCount - completedCount;
  const hasActiveFilters = currentFilter !== 'all' || selectedCategory !== '' || sortByPriority;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-surface p-6 shadow-card">
      <div className="flex flex-wrap justify-center gap-3">
        <button 
          className={`rounded-full border px-5 py-2 font-medium transition-colors ${
            currentFilter === 'all'
              ? 'border-primary bg-primary text-white hover:text-white'
              : 'border-border bg-surface text-muted hover:border-primary hover:text-primary'
          }`}
          onClick={() => onFilterChange('all')}
        >
          Всі ({totalCount})
        </button>
        <button 
          className={`rounded-full border px-5 py-2 font-medium transition-colors ${
            currentFilter === 'completed'
              ? 'border-primary bg-primary text-white hover:text-white'
              : 'border-border bg-surface text-muted hover:border-primary hover:text-primary'
          }`}
          onClick={() => onFilterChange('completed')}
        >
          Виконані ({completedCount})
        </button>
        <button 
          className={`rounded-full border px-5 py-2 font-medium transition-colors ${
            currentFilter === 'uncompleted'
              ? 'border-primary bg-primary text-white hover:text-white'
              : 'border-border bg-surface text-muted hover:border-primary hover:text-primary'
          }`}
          onClick={() => onFilterChange('uncompleted')}
        >
          Не виконані ({uncompletedCount})
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 border-t border-border pt-4">
        <select 
          className="rounded-md border border-border bg-input p-2 text-text focus:border-primary focus:outline-none"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Всі категорії</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
          <input 
            type="checkbox" 
            checked={sortByPriority}
            onChange={(e) => onSortChange(e.target.checked)}
          />
          Сортувати за пріоритетом
        </label>

        <button
          type="button"
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            hasActiveFilters
              ? 'border-primary bg-primary text-white hover:bg-primary-hover'
              : 'border-border bg-surface text-text hover:border-primary hover:text-primary'
          }`}
          onClick={onResetFilters}
        >
          {'Скинути фільтри'}
        </button>
      </div>
    </div>
  );
}