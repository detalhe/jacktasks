import express from 'express';
import { addTask, getAllTasks, updateTaskById, deleteTaskById } from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', addTask);
router.get('/', getAllTasks);
router.put('/:id', updateTaskById);
router.delete('/:id', deleteTaskById);

export default router;
