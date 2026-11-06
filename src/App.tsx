import { useState, useEffect } from 'react';
import type { Task } from './types/task';
import { initialTasks } from './data/initialTasks';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskStats } from './components/TaskStats';
import { TaskList } from './components/TaskList';

export type FilterType = 'all' | 'completed' | 'uncompleted';

const priorityWeight = { high: 3, medium: 2, low: 1 };

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterType>('all');
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

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        ...taskData,
        id: currentTasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1,
        completed: false,
      },
    ]);
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const processedTasks = tasks.filter((task) => {
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'uncompleted' && task.completed) return false;
    if (selectedCategory && task.category !== selectedCategory) return false;
    return true;
  });

  processedTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
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
        <TaskForm onAdd={addTask} existingCategories={uniqueCategories} />
        
        <TaskStats tasks={tasks} />
        
        <TaskFilters 
          currentFilter={filter} 
          onFilterChange={setFilter} 
          tasks={tasks}
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortByPriority={sortByPriority}
          onSortChange={setSortByPriority}
          onResetFilters={resetFilters}
        />
        
        <TaskList 
          tasks={processedTasks} 
          onToggle={toggleTaskStatus} 
          onDelete={deleteTask} 
          hasAnyTasks={tasks.length > 0}
        />
      </main>
    </div>
  );
}