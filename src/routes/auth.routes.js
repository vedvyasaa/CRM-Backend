// // src/routes/auth.routes.js
// import express from 'express';
// import { login, register, me } from '../controller/auth.controller.js';
// import { auth } from '../middleware/auth.middleware.js';
// const router = express.Router();

// router.post('/login', login);
// router.post('/register', register); // wrap with permit('Admin') if admin-only
// router.get('/me', auth, me);

// export default router;

// src/routes/auth.routes.js
// src/routes/auth.routes.js
import express from 'express';
import { login, register, me } from '../controllers/auth.controller.js'; // controllers (plural)
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register); // consider wrapping with permit('Admin')
router.get('/me', auth, me);

export default router;


