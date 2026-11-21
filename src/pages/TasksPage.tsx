import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';
import { TaskFormDialog } from '../components/TaskFormDialog';
import { useAuth } from '../hooks/useAuth';
import type { TaskFormData } from '../schemas/taskSchema';
import './TasksPage.scss';

export function TasksPage() {
  const { tasks, addTask, setFilter, setSelectedCategory, setSelectedPriority, setSortByPriority } = useTaskContext();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const uncompletedCount = tasks.filter((t) => !t.completed).length;
    document.title = `Study Planner | ${uncompletedCount} active tasks`;
  }, [tasks]);

  useEffect(() => {
    const status = searchParams.get('status');
    setFilter(status === 'completed' || status === 'uncompleted' ? status : 'all');
    setSelectedCategory(searchParams.get('category') ?? '');
    setSelectedPriority(searchParams.get('priority') ?? '');
    setSortByPriority(searchParams.get('sort') === 'priority');
  }, [searchParams, setFilter, setSelectedCategory, setSelectedPriority, setSortByPriority]);

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
        {isLoading ? null : (
          <button type="button" className="tasks-page__create" onClick={openCreateDialog}>
            + Створити
          </button>
        )}
      </div>
      <TaskFilters />
      <TaskList />
      <TaskFormDialog
        open={dialogOpen}
        mode="create"
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />
    </section>
  );
}