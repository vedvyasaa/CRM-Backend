// src/routes/client.routes.js
import express from 'express';
import { listClients, getClient, createClient, updateClient, deleteClient } from '../controllers/client.controller.js';
import { auth, permit } from '../middleware/auth.middleware.js';
const router = express.Router();

router.use(auth);
router.get('/', permit('Admin','Staff'), listClients);
router.post('/', permit('Admin','Staff'), createClient);
router.get('/:id', auth, getClient); // any authenticated user can request; controllers should enforce ownership if needed
router.put('/:id', permit('Admin','Staff'), updateClient);
router.delete('/:id', permit('Admin'), deleteClient);

export default router;
