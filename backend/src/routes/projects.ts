import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { validateCreateProject, validateId, handleValidationErrors } from '../utils/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Всі маршрути захищені
router.use(authenticate);

// CRUD операції для проєктів
router.post('/', validateCreateProject, handleValidationErrors, ProjectController.createProject);
router.get('/', ProjectController.getProjects);
router.get('/:id', validateId, handleValidationErrors, ProjectController.getProject);
router.put('/:id', validateId, handleValidationErrors, ProjectController.updateProject);
router.delete('/:id', validateId, handleValidationErrors, ProjectController.deleteProject);
router.get('/:id/stats', validateId, handleValidationErrors, ProjectController.getProjectStats);

// Управління учасниками проєкту
router.post('/:id/members', validateId, handleValidationErrors, ProjectController.addProjectMember);
router.delete('/:id/members/:userId', validateId, handleValidationErrors, ProjectController.removeProjectMember);
router.put('/:id/members/:userId/role', validateId, handleValidationErrors, ProjectController.updateProjectMemberRole);

export default router;
