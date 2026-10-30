import { useState } from 'react';
import type { Task } from './types/task';
import { initialTasks } from './data/initialTasks';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskStats } from './components/TaskStats';
import { TaskList } from './components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  // Зміна статусу завдання (імутабельно через map)
  const toggleTaskStatus = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Видалення завдання (імутабельно через filter)
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <TaskForm onAdd={addTask} />
        <TaskStats />
        <TaskFilters />
        <TaskList 
          tasks={tasks} 
          onToggle={toggleTaskStatus} 
          onDelete={deleteTask} 
        />
      </main>
    </div>
  );
}