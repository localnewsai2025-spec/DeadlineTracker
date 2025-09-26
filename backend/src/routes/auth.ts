import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRegister, validateLogin, handleValidationErrors } from '../utils/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Публічні маршрути
router.post('/register', validateRegister, handleValidationErrors, AuthController.register);
router.post('/login', validateLogin, handleValidationErrors, AuthController.login);

// Захищені маршрути
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, AuthController.updateProfile);
router.put('/change-password', authenticate, AuthController.changePassword);
router.post('/logout', authenticate, AuthController.logout);

export default router;
