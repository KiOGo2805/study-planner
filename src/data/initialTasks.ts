import { type Task } from '../types/task';

export const initialTasks: Task[] = [
    {
        id: 1,
        title: 'TypeScript Exercises',
        description: 'Виконати практичні вправи',
        completed: true,
        priority: 'medium',
        category: 'TypeScript',
        createdAt: Date.now()
    },
  {
      id: 2,
      title: 'React Components',
      description: 'Опрацювати базові принципи компонентів React',
      completed: false,
      priority: 'high',
      category: 'React',
      createdAt: Date.now()
  },
];