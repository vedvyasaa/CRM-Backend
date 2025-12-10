// // src/routes/lead.routes.js
// import express from 'express';
// import { convertLead } from '../controller/lead.controller.js';
// import { auth, permit } from '../middleware/auth.middleware.js';
// const router = express.Router();

// // convert lead -> client
// router.post('/:id/convert', auth, permit('Admin', 'Staff'), convertLead);

// // TODO: add other CRUD routes for leads (GET/POST/PUT/DELETE)

// export default router;

// src/routes/lead.routes.js
import express from 'express';
import { listLeads, getLead, createLead, updateLead, deleteLead, convertLead } from '../controllers/lead.controller.js';
import { auth, permit } from '../middleware/auth.middleware.js';
const router = express.Router();

router.use(auth);
router.get('/', permit('Admin','Staff'), listLeads);
router.post('/', permit('Admin','Staff'), createLead);
router.get('/:id', permit('Admin','Staff'), getLead);
router.put('/:id', permit('Admin','Staff'), updateLead);
router.delete('/:id', permit('Admin'), deleteLead);
router.post('/:id/convert', permit('Admin','Staff'), convertLead);

export default router;

