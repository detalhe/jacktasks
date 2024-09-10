import pool from '../config/database';

export interface Task {
  id?: number;
  userId: number;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
}

export const createTask = async (task: Task): Promise<number> => {
  const [result] = await pool.execute(
    'INSERT INTO tasks (userId, title, description, date, completed) VALUES (?, ?, ?, ?, ?)',
    [task.userId, task.title, task.description, task.date, task.completed]
  );
  return (result as any).insertId;
};

export const getTasks = async (userId: number): Promise<Task[]> => {
  const [rows] = await pool.execute('SELECT * FROM tasks WHERE userId = ?', [userId]);
  return rows as Task[];
};

export const getTaskById = async (taskId: number, userId: number): Promise<Task | null> => {
  const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);
  return (rows as Task[])[0] || null;
};

export const updateTask = async (task: Task): Promise<void> => {
  await pool.execute(
    'UPDATE tasks SET title = ?, description = ?, date = ?, completed = ? WHERE id = ? AND userId = ?',
    [task.title, task.description, task.date, task.completed, task.id, task.userId]
  );
};

export const deleteTask = async (taskId: number, userId: number): Promise<void> => {
  await pool.execute('DELETE FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);
};
