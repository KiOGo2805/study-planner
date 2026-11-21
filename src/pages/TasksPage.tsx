import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';
import { TaskFormDialog } from '../components/TaskFormDialog';
import { useAuth } from '../hooks/useAuth';
import type { TaskFormData } from '../schemas/taskSchema';
import './TasksPage.scss';

export function TasksPage() {
  const { tasks, addTask } = useTaskContext();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const uncompletedCount = tasks.filter((t) => !t.completed).length;
    document.title = `Study Planner | ${uncompletedCount} active tasks`;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const status = searchParams.get('status');
    const category = searchParams.get('category') ?? '';
    const priority = searchParams.get('priority') ?? '';
    const priorityWeight = { low: 1, medium: 2, high: 3 };

    return tasks
      .filter((task) => {
        if (status === 'completed' && !task.completed) return false;
        if (status === 'uncompleted' && task.completed) return false;
        if (category && task.category !== category) return false;
        if (priority && task.priority !== priority) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (searchParams.get('sort') === 'priority') {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return 0;
      });
  }, [tasks, searchParams]);

  const openCreateDialog = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/tasks' } }, replace: false });
      return;
    }
    setDialogOpen(true);
  };

  const handleCreate = async (data: TaskFormData) => {
    await addTask({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      createdBy: 'Authorized User',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <section className="tasks-page">
      <div className="tasks-page__header">
        <h1 className="tasks-page__title">Завдання</h1>
        {isLoading ? null : isAuthenticated ? (
          <button type="button" className="tasks-page__create" onClick={openCreateDialog}>
            + Створити
          </button>
        ) : null}
      </div>
      <TaskFilters />
      <TaskList filteredTasks={filteredTasks} />
      <TaskFormDialog
        open={dialogOpen}
        mode="create"
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />
    </section>
  );
}