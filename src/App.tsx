import { useEffect } from 'react';
import { useTaskContext } from './hooks/useTaskContext';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';

export default function App() {
  const { tasks } = useTaskContext();

  useEffect(() => {
    const uncompletedCount = tasks.filter(t => !t.completed).length;
    document.title = `Study Planner | ${uncompletedCount} active tasks`;
  }, [tasks]);

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <TaskForm />
        <TaskFilters />
        <TaskList />
      </main>
      <Toast />
    </div>
  );
}