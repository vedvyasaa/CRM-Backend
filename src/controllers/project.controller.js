// src/controllers/project.controller.js
import { Project, Client, User, ProjectComment } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export async function listProjects(req, res, next) {
  try {
    const where = {};
    if (req.query.clientId) where.clientId = req.query.clientId;
    const projects = await Project.findAll({ where, include: [{ model: Client, as: 'client' }, { model: User, as: 'staff', attributes: ['id', 'name', 'email'] }, { model: ProjectComment, as: 'comments' }], order: [['createdAt', 'DESC']] });
    res.json({ data: projects });
  } catch (err) { next(err); }
}

export async function getProject(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.id, { include: [{ model: Client, as: 'client' }, { model: User, as: 'staff', attributes: ['id', 'name', 'email'] }, { model: ProjectComment, as: 'comments' }] });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) { next(err); }
}

export async function createProject(req, res, next) {
  try {
    const { clientId, title, description, startDate, endDate, status = 'Planned', progress = 0, assignedStaff = [] } = req.body;
    const client = await Client.findByPk(clientId);
    if (!client) return res.status(400).json({ error: 'Invalid clientId' });
    const project = await Project.create({
      // id: uuidv4(),
      clientId,
      title,
      description,
      startDate,
      endDate,
      status,
      progress
    });
    if (Array.isArray(assignedStaff) && assignedStaff.length > 0) {
      for (const s of assignedStaff) {
        const staff = await User.findByPk(s);
        if (staff) await project.addStaff(staff);
      }
    }
    res.status(201).json({ project });
  } catch (err) { next(err); }
}

export async function updateProject(req, res, next) {
  try {
    const id = req.params.id;
    const allowed = ['title', 'description', 'startDate', 'endDate', 'status', 'progress'];
    const payload = {};
    for (const k of allowed) if (req.body[k] !== undefined) payload[k] = req.body[k];
    await Project.update(payload, { where: { id } });
    const project = await Project.findByPk(id);
    res.json({ project });
  } catch (err) { next(err); }
}

export async function deleteProject(req, res, next) {
  try {
    const id = req.params.id;
    const p = await Project.findByPk(id);
    if (!p) return res.status(404).json({ error: 'Project not found' });
    await p.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}
