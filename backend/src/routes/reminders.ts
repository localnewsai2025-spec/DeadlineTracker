import { Router } from 'express';
import { ReminderController } from '../controllers/reminderController';
import { validateCreateReminder, validateId, handleValidationErrors } from '../utils/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Всі маршрути захищені
router.use(authenticate);

// CRUD операції для нагадувань
router.post('/', validateCreateReminder, handleValidationErrors, ReminderController.createReminder);
router.get('/upcoming', ReminderController.getUpcomingReminders);
router.get('/task/:taskId', validateId, handleValidationErrors, ReminderController.getRemindersByTask);
router.put('/:id', validateId, handleValidationErrors, ReminderController.updateReminder);
router.delete('/:id', validateId, handleValidationErrors, ReminderController.deleteReminder);

export default router;
