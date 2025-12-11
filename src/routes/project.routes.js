// src/routes/project.routes.js
import express from 'express';
import { listProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/project.controller.js';
import { auth, permit } from '../middleware/auth.middleware.js';
const router = express.Router();

router.use(auth);
router.get('/', permit('Admin','Staff','Client'), listProjects);
router.post('/', permit('Admin','Staff'), createProject);
router.get('/:id', permit('Admin','Staff','Client'), getProject);
router.put('/:id', permit('Admin','Staff'), updateProject);
router.delete('/:id', permit('Admin'), deleteProject);

export default router;
