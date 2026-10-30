import type { FilterType } from '../App';
import type { Task } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  tasks: Task[];
}

export function TaskFilters({ currentFilter, onFilterChange, tasks }: TaskFiltersProps) {
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const uncompletedCount = totalCount - completedCount;

  return (
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
  );
}