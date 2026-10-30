import type { FilterType } from '../App';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="task-filters">
      <button 
        className={`task-filters__btn ${currentFilter === 'all' ? 'task-filters__btn--active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        Всі
      </button>
      <button 
        className={`task-filters__btn ${currentFilter === 'completed' ? 'task-filters__btn--active' : ''}`}
        onClick={() => onFilterChange('completed')}
      >
        Виконані
      </button>
      <button 
        className={`task-filters__btn ${currentFilter === 'uncompleted' ? 'task-filters__btn--active' : ''}`}
        onClick={() => onFilterChange('uncompleted')}
      >
        Не виконані
      </button>
    </div>
  );
}