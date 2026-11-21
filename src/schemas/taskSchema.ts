import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, "Назва завдання є обов'язковою").max(100, 'Максимум 100 символів'),
  description: z.string().max(500, 'Максимум 500 символів'),
  category: z.string().min(1, "Категорія є обов'язковою"),
  priority: z.enum(['low', 'medium', 'high']),
});

export type TaskFormData = z.infer<typeof taskSchema>;