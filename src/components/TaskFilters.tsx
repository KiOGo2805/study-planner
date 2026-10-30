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

  return (
    <div className="controls">
      <div className="task-filters">
        <button 
          className={`task-filters__btn ${currentFilter === 'all' ? 'task-filters__btn--active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Всі ({totalCount})
        </button>
        <button 
          className={`task-filters__btn ${currentFilter === 'completed' ? 'task-filters__btn--active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Виконані ({completedCount})
        </button>
        <button 
          className={`task-filters__btn ${currentFilter === 'uncompleted' ? 'task-filters__btn--active' : ''}`}
          onClick={() => onFilterChange('uncompleted')}
        >
          Не виконані ({uncompletedCount})
        </button>
      </div>

      <div className="extra-filters">
        <select 
          className="extra-filters__select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Всі категорії</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <label className="extra-filters__sort">
          <input 
            type="checkbox" 
            checked={sortByPriority}
            onChange={(e) => onSortChange(e.target.checked)}
          />
          Сортувати за пріоритетом
        </label>

        <button
          type="button"
          className="extra-filters__reset"
          onClick={onResetFilters}
        >
          Скинути фільтри
        </button>
      </div>
    </div>
  );
}