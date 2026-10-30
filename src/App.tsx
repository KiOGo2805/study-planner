import { useState } from 'react';
import { Header } from './components/Header';
import { TaskFilters } from './components/TaskFilters';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { TaskStats } from './components/TaskStats';
import { initialTasks } from './data/initialTasks';
import { type Task } from './types/task';

export default function App() {
  const [tasks] = useState<Task[]>(initialTasks);

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <TaskForm />
        <TaskStats />
        <TaskFilters />
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
}
