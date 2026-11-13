import { useTaskContext } from '../hooks/useTaskContext';

export function TaskFilters() {
  const {
    tasks,
    categories,
    filter: currentFilter,
    setFilter: onFilterChange,
    selectedCategory,
    setSelectedCategory,
    sortByPriority,
    setSortByPriority,
    resetFilters,
  } = useTaskContext();
  
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const uncompletedCount = totalCount - completedCount;
  const hasActiveFilters = currentFilter !== 'all' || selectedCategory !== '' || sortByPriority;

  return (
    <div className="controls">
      <div className="task-filters">
        <button 
          className={`task-filters__btn ${currentFilter === 'all' ? 'task-filters__btn--active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Всі тут ({totalCount})
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
          onChange={(e) => setSelectedCategory(e.target.value)}
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
            onChange={(e) => setSortByPriority(e.target.checked)}
          />
          Сортувати за пріоритетом
        </label>

        <button
          type="button"
          className={`extra-filters__reset ${hasActiveFilters ? 'extra-filters__reset--active' : ''}`}
          onClick={resetFilters}
        >
          Скинути фільтри
        </button>
      </div>
    </div>
  );
}