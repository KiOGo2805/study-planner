import { useTaskContext } from '../hooks/useTaskContext';
import { useSearchParams } from 'react-router';
import type { FilterType } from '../context/taskContextValue';
import './TaskFilters.scss';

export function TaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    tasks,
    categories,
  } = useTaskContext();

  const currentFilter = (searchParams.get('status') as FilterType) || 'all';
  const selectedCategory = searchParams.get('category') ?? '';
  const selectedPriority = searchParams.get('priority') ?? '';
  const sortByPriority = searchParams.get('sort') === 'priority';

  const updateParams = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };
  
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const uncompletedCount = totalCount - completedCount;
  const hasActiveFilters = currentFilter !== 'all' || selectedCategory !== '' || selectedPriority !== '' || sortByPriority;

  return (
    <div className="controls">
      <div className="task-filters">
        <button 
          className={`task-filters__btn ${currentFilter === 'all' ? 'task-filters__btn--active' : ''}`}
          onClick={() => updateParams('status', 'all')}
        >
          Всі тут ({totalCount})
        </button>
        <button 
          className={`task-filters__btn ${currentFilter === 'completed' ? 'task-filters__btn--active' : ''}`}
          onClick={() => updateParams('status', 'completed')}
        >
          Виконані ({completedCount})
        </button>
        <button 
          className={`task-filters__btn ${currentFilter === 'uncompleted' ? 'task-filters__btn--active' : ''}`}
          onClick={() => updateParams('status', 'uncompleted')}
        >
          Не виконані ({uncompletedCount})
        </button>
      </div>

      <div className="extra-filters">
        <select 
          className="extra-filters__select"
          value={selectedCategory}
          onChange={(e) => updateParams('category', e.target.value)}
        >
          <option value="">Всі категорії</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="extra-filters__select"
          value={selectedPriority}
          onChange={(e) => updateParams('priority', e.target.value)}
          aria-label="Фільтр за пріоритетом"
        >
          <option value="">Всі пріоритети</option>
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
        
        <label className="extra-filters__sort">
          <input 
            type="checkbox" 
            checked={sortByPriority}
            onChange={(e) => updateParams('sort', e.target.checked ? 'priority' : '')}
          />
          Сортувати за пріоритетом
        </label>

        <button
          type="button"
          className={`extra-filters__reset ${hasActiveFilters ? 'extra-filters__reset--active' : ''}`}
          onClick={() => setSearchParams({}, { replace: true })}
        >
          Скинути фільтри
        </button>
      </div>
    </div>
  );
}