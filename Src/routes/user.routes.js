// import express from "express";
// import { createUser, listUsers, updateUser, deleteUser } from "../controller/user.controller.js";

// const router = express.Router();

// router.post("/", createUser);
// router.get("/", listUsers);
// router.put("/updateUser/:id", updateUser)
// router.delete("/deleteUser/:id", deleteUser)

// export default router;

// src/routes/user.routes.js
// src/routes/user.routes.js
import express from 'express';
import { listUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { auth, permit } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(auth);
router.get('/', permit('Admin'), listUsers);
router.post('/', permit('Admin'), createUser);
router.get('/:id', permit('Admin'), getUser);
router.put('/:id', permit('Admin'), updateUser);
router.delete('/:id', permit('Admin'), deleteUser);

export default router;

