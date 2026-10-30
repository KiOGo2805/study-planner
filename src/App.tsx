import { useState } from 'react';
import type { Task } from './types/task';
import { initialTasks } from './data/initialTasks';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskStats } from './components/TaskStats';
import { TaskList } from './components/TaskList';

export type FilterType = 'all' | 'completed' | 'uncompleted';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterType>('all');

  // Отримуємо масив унікальних категорій для автозаповнення
  const uniqueCategories = Array.from(new Set(tasks.map(t => t.category)));

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'uncompleted') return !task.completed;
    return true; 
  });

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        {/* Передаємо унікальні категорії */}
        <TaskForm onAdd={addTask} existingCategories={uniqueCategories} />
        <TaskStats tasks={tasks} />
        {/* Передаємо масив tasks для лічильників */}
        <TaskFilters currentFilter={filter} onFilterChange={setFilter} tasks={tasks} />
        <TaskList 
          tasks={filteredTasks} 
          onToggle={toggleTaskStatus} 
          onDelete={deleteTask} 
          currentFilter={filter}
        />
      </main>
    </div>
  );
}