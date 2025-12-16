// src/controllers/client.controller.js
import { Client, Project, User } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export async function listClients(req, res, next) {
  try {
    const clients = await Client.findAll({ include: [{ model: User, as: 'staff', attributes: ['id', 'name', 'email'] }, { model: Project, as: 'projects' }] });
    res.json({ data: clients });
  } catch (err) { next(err); }
}

export async function getClient(req, res, next) {
  try {
    const client = await Client.findByPk(req.params.id, { include: [{ model: User, as: 'staff', attributes: ['id', 'name', 'email'] }, { model: Project, as: 'projects' }] });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json({ client });
  } catch (err) { next(err); }
}

export async function createClient(req, res, next) {
  try {
    const { name, email, phone, address, assignedStaff = [] } = req.body;
    const client = await Client.create({ 
      //id: uuidv4(), 
      name, 
      email, 
      phone, 
      address });
    if (Array.isArray(assignedStaff) && assignedStaff.length > 0) {
      for (const s of assignedStaff) {
        const staff = await User.findByPk(s);
        if (staff) await client.addStaff(staff);
      }
    }
    res.status(201).json({ client });
  } catch (err) { next(err); }
}

export async function updateClient(req, res, next) {
  try {
    const id = req.params.id;
    const allowed = ['name', 'email', 'phone', 'address'];
    const payload = {};
    for (const k of allowed) if (req.body[k] !== undefined) payload[k] = req.body[k];
    await Client.update(payload, { where: { id } });
    const client = await Client.findByPk(id);
    res.json({ client });
  } catch (err) { next(err); }
}

export async function deleteClient(req, res, next) {
  try {
    const id = req.params.id;
    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    await client.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}
