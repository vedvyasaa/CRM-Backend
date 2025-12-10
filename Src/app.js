// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import userRoutes from "./routes/user.routes.js"

// const app = express();
// app.use(express.json());

// app.use("/api/users", userRoutes);
// app.get("/", (req, res) => res.send("API Running"));

// export default app;

// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import './models/index.js'; // register associations
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import leadRoutes from './routes/lead.routes.js';
import clientRoutes from './routes/client.routes.js';
import projectRoutes from './routes/project.routes.js';
import dashboardRoutes from './routes/dashbaord.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => res.send('Mini CRM API running'));
app.use(errorHandler);

export default app;
