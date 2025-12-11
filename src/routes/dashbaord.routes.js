// src/routes/dashboard.routes.js
import express from 'express';
import { summary } from '../controllers/dashboard.controller.js';
import { auth, permit } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/summary', auth, permit('Admin','Staff'), summary);

export default router;
