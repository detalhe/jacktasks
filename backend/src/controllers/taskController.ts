import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../models/Task';

export const addTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, description, date } = req.body;
    const taskId = await createTask({ userId, title, description, date, completed: false });
    res.status(201).json({ id: taskId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding task' });
  }
};

export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const tasks = await getTasks(userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const updateTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const taskId = parseInt(req.params.id);
    const { title, description, date, completed } = req.body;

    const existingTask = await getTaskById(taskId, userId);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    await updateTask({ id: taskId, userId, title, description, date, completed });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const taskId = parseInt(req.params.id);

    const existingTask = await getTaskById(taskId, userId);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    await deleteTask(taskId, userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};
