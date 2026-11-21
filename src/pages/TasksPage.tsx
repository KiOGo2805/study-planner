import { useEffect } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskForm } from '../components/TaskForm';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';

export function TasksPage() {
  const { tasks } = useTaskContext();

  useEffect(() => {
    const uncompletedCount = tasks.filter((t) => !t.completed).length;
    document.title = `Study Planner | ${uncompletedCount} active tasks`;
  }, [tasks]);

  return (
    <section className="tasks-page">
      <TaskForm />
      <TaskFilters />
      <TaskList />
    </section>
  );
}