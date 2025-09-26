import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { validateCreateTask, validateUpdateTask, validateId, handleValidationErrors } from '../utils/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Всі маршрути захищені
router.use(authenticate);

// CRUD операції для завдань
router.post('/', validateCreateTask, handleValidationErrors, TaskController.createTask);
router.get('/', TaskController.getTasks);
router.get('/overdue', TaskController.getOverdueTasks);
router.get('/upcoming', TaskController.getUpcomingTasks);
router.get('/stats', TaskController.getTaskStats);
router.get('/:id', validateId, handleValidationErrors, TaskController.getTask);
router.put('/:id', validateId, validateUpdateTask, handleValidationErrors, TaskController.updateTask);
router.delete('/:id', validateId, handleValidationErrors, TaskController.deleteTask);
router.patch('/:id/status', validateId, handleValidationErrors, TaskController.updateTaskStatus);

export default router;
