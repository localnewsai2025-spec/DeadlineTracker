import { Router } from 'express';
import authRoutes from './auth';
import taskRoutes from './tasks';
import projectRoutes from './projects';
import reminderRoutes from './reminders';
import userRoutes from './users';

const router = Router();

// API маршрути
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/projects', projectRoutes);
router.use('/reminders', reminderRoutes);
router.use('/users', userRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
