import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../schemas/taskSchema';
import type { Task } from '../types/task';
import './TaskFormDialog.scss';

export type TaskFormDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
};

export function TaskFormDialog({ open, mode, task, onClose, onSubmit }: TaskFormDialogProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      category: task?.category ?? '',
      priority: task?.priority ?? 'medium',
    });
    window.setTimeout(() => titleRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, task, reset, onClose]);

  if (!open) return null;

  const submit = async (data: TaskFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="task-form-dialog" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="task-form-dialog__card" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title">
        <h2 id="task-dialog-title" className="task-form-dialog__title">
          {mode === 'create' ? 'Створити завдання' : 'Редагувати завдання'}
        </h2>
        <form className="task-form-dialog__form" onSubmit={handleSubmit(submit)} noValidate>
          <label className="task-form-dialog__field">
            <span>Назва</span>
            <input
              className="task-form-dialog__input"
              {...register('title', {
                setValueAs: undefined,
              })}
              ref={(element) => {
                titleRef.current = element;
                register('title').ref(element);
              }}
              disabled={isSubmitting}
            />
            {errors.title && <small className="task-form-dialog__error">{errors.title.message}</small>}
          </label>
          <label className="task-form-dialog__field">
            <span>Опис</span>
            <textarea className="task-form-dialog__input" rows={4} {...register('description')} disabled={isSubmitting} />
            {errors.description && <small className="task-form-dialog__error">{errors.description.message}</small>}
          </label>
          <label className="task-form-dialog__field">
            <span>Категорія</span>
            <input className="task-form-dialog__input" {...register('category')} disabled={isSubmitting} />
            {errors.category && <small className="task-form-dialog__error">{errors.category.message}</small>}
          </label>
          <label className="task-form-dialog__field">
            <span>Пріоритет</span>
            <select className="task-form-dialog__input" {...register('priority')} disabled={isSubmitting}>
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
            </select>
          </label>
          <div className="task-form-dialog__actions">
            <button type="button" className="task-form-dialog__cancel" onClick={onClose} disabled={isSubmitting}>Close/Cancel</button>
            <button type="submit" className="task-form-dialog__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Збереження...' : 'Submit'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
