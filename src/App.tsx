import { useState } from 'react';
import type { Task, Priority } from './types/task';
import { initialTasks } from './data/initialTasks';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskStats } from './components/TaskStats';
import { TaskList } from './components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Функція додавання завдання
  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(), // Генеруємо унікальний ID
      completed: false, // Нове завдання за замовчуванням не виконане
    };
    // Імутабельне оновлення стану
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        {/* Передаємо функцію як prop */}
        <TaskForm onAdd={addTask} />
        <TaskStats />
        <TaskFilters />
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
}