import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateId, handleValidationErrors } from '../utils/validation';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Всі маршрути захищені
router.use(authenticate);

// CRUD операції для користувачів (тільки для адміністраторів)
router.get('/', requireAdmin, UserController.getUsers);
router.get('/:id', validateId, handleValidationErrors, UserController.getUser);
router.put('/:id', validateId, handleValidationErrors, UserController.updateUser);
router.delete('/:id', validateId, handleValidationErrors, UserController.deleteUser);
router.put('/:id/role', validateId, handleValidationErrors, UserController.changeUserRole);
router.get('/:id/stats', validateId, handleValidationErrors, UserController.getUserStats);

export default router;
