import { useState, useEffect } from 'react';
import type { Task } from './types/task';
import { initialTasks } from './data/initialTasks';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';

export type FilterType = 'all' | 'completed' | 'uncompleted';

// Вага пріоритетів для сортування
const priorityWeight = { high: 3, medium: 2, low: 1 };

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Нові стани для додаткових завдань
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortByPriority, setSortByPriority] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Перемикання темної теми на рівні HTML-документа
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkTheme]);

  const uniqueCategories = Array.from(new Set(tasks.map(t => t.category)));

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = { ...taskData, id: Date.now(), completed: false };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Комплексна фільтрація та сортування
  let processedTasks = tasks.filter((task) => {
    // 1. Фільтр за статусом
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'uncompleted' && task.completed) return false;
    // 2. Фільтр за категорією
    if (selectedCategory && task.category !== selectedCategory) return false;
    return true;
  });

  // 3. Сортування (mutates the newly created filtered array, which is safe)
  if (sortByPriority) {
    processedTasks.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  }

  return (
    <div className="app">
      <Header isDarkTheme={isDarkTheme} onToggleTheme={() => setIsDarkTheme(!isDarkTheme)} />
      <main className="app__main">
        <TaskForm onAdd={addTask} existingCategories={uniqueCategories} />
        
        {/* Додані нові пропси для керування сортуванням і категоріями */}
        <TaskFilters 
          currentFilter={filter} 
          onFilterChange={setFilter} 
          tasks={tasks}
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortByPriority={sortByPriority}
          onSortChange={setSortByPriority}
        />
        
        <TaskList 
          tasks={processedTasks} 
          onToggle={toggleTaskStatus} 
          onDelete={deleteTask} 
          currentFilter={filter}
        />
      </main>
    </div>
  );
}