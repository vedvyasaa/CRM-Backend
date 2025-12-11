// src/controllers/dashboard.controller.js
import { Lead, Client, Project, sequelize } from '../models/index.js';
import { QueryTypes } from 'sequelize';

export async function summary(req, res, next) {
  try {
    // total counts
    const totalLeads = await Lead.count();
    const totalClients = await Client.count();
    const totalProjects = await Project.count();

    // leads by stage
    const leadsByStageRaw = await sequelize.query(
      `SELECT stage, COUNT(*) as count FROM leads GROUP BY stage`, { type: QueryTypes.SELECT }
    );
    const leadsByStage = {};
    leadsByStageRaw.forEach(r => leadsByStage[r.stage] = parseInt(r.count,10));

    // projects by status
    const projectsByStatusRaw = await sequelize.query(
      `SELECT status, COUNT(*) as count FROM projects GROUP BY status`, { type: QueryTypes.SELECT }
    );
    const projectsByStatus = {};
    projectsByStatusRaw.forEach(r => projectsByStatus[r.status] = parseInt(r.count,10));

    const activeProjects = await Project.count({ where: { status: 'Active' } });

    res.json({
      totalLeads,
      leadsByStage,
      totalClients,
      totalProjects,
      activeProjects,
      projectsByStatus
    });
  } catch (err) { next(err); }
}
