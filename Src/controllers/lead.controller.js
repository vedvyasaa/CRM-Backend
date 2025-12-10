// src/controllers/lead.controller.js
import { Lead, Client, sequelize, User } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export async function listLeads(req, res, next) {
  try {
    // basic list. Add filters/pagination as needed.
    const leads = await Lead.findAll({ include: [{ model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }], order: [['createdAt', 'DESC']] });
    res.json({ data: leads });
  } catch (err) { next(err); }
}

export async function getLead(req, res, next) {
  try {
    const lead = await Lead.findByPk(req.params.id, { include: [{ model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }] });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ lead });
  } catch (err) { next(err); }
}

export async function createLead(req, res, next) {
  try {
    const { name, email, phone, source, assignedToId, notes } = req.body;
    const lead = await Lead.create({ id: uuidv4(), name, email, phone, source, notes, assignedToId: assignedToId || null });
    res.status(201).json({ lead });
  } catch (err) { next(err); }
}

export async function updateLead(req, res, next) {
  try {
    const id = req.params.id;
    const allowed = ['name', 'email', 'phone', 'source', 'stage', 'notes', 'assignedToId'];
    const payload = {};
    for (const k of allowed) if (req.body[k] !== undefined) payload[k] = req.body[k];
    const [count] = await Lead.update(payload, { where: { id } });
    if (!count) return res.status(404).json({ error: 'Lead not found' });
    const lead = await Lead.findByPk(id);
    res.json({ lead });
  } catch (err) { next(err); }
}

export async function deleteLead(req, res, next) {
  try {
    const id = req.params.id;
    const lead = await Lead.findByPk(id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    await lead.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function convertLead(req, res, next) {
  const leadId = req.params.id;
  const t = await sequelize.transaction();
  try {
    const lead = await Lead.findByPk(leadId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!lead) { await t.rollback(); return res.status(404).json({ error: 'Lead not found' }); }
    if (lead.stage === 'Converted') { await t.rollback(); return res.status(400).json({ error: 'Lead already converted' }); }

    const { address = null, assignedStaff = [] } = req.body;

    const client = await Client.create({
      id: uuidv4(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address,
      originalLeadId: lead.id
    }, { transaction: t });

    // attach staff: if assignedStaff array provided, link; else if lead.assignedToId, link that.
    if (Array.isArray(assignedStaff) && assignedStaff.length > 0) {
      for (const staffId of assignedStaff) {
        const staff = await User.findByPk(staffId);
        if (staff) {
          await client.addStaff(staff, { transaction: t });
        }
      }
    } else if (lead.assignedToId) {
      const staff = await User.findByPk(lead.assignedToId);
      if (staff) {
        await client.addStaff(staff, { transaction: t });
      }
    }

    lead.stage = 'Converted';
    await lead.save({ transaction: t });

    await t.commit();
    res.status(201).json({ client });
  } catch (err) {
    await t.rollback().catch(() => { });
    next(err);
  }
}
