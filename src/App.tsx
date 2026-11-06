import { useState, useEffect } from 'react';
import { useTaskContext } from './hooks/useTaskContext';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskStats } from './components/TaskStats';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';

const priorityWeight = { high: 3, medium: 2, low: 1 };

export default function App() {
  const { tasks, filter, setFilter } = useTaskContext();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortByPriority, setSortByPriority] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const resetFilters = () => {
    setFilter('all');
    setSelectedCategory('');
    setSortByPriority(false);
  };

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkTheme]);

  const uniqueCategories = Array.from(new Set(tasks.map(t => t.category)));

  const processedTasks = tasks.filter((task) => {
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'uncompleted' && task.completed) return false;
    if (selectedCategory && task.category !== selectedCategory) return false;
    return true;
  });

  processedTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (sortByPriority) {
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
    }
    return 0;
  });

  return (
    <div className="app">
      <Header isDarkTheme={isDarkTheme} onToggleTheme={() => setIsDarkTheme(!isDarkTheme)} />
      <main className="app__main">
        <TaskForm existingCategories={uniqueCategories} />
        <TaskStats />
        <TaskFilters 
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortByPriority={sortByPriority}
          onSortChange={setSortByPriority}
          onResetFilters={resetFilters}
        />
        <TaskList 
          tasks={processedTasks} 
          hasAnyTasks={tasks.length > 0}
        />
      </main>
      <Toast />
    </div>
  );
}