// src/controllers/user.controller.js
import { User } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const SALT = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export async function listUsers(req, res, next) {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'phone', 'createdAt'] });
    res.json({ data: users });
  } catch (err) { next(err); }
}

export async function getUser(req, res, next) {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, { attributes: ['id', 'name', 'email', 'role', 'phone', 'createdAt'] });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) { next(err); }
}

// export async function createUser(req, res, next) {
//   try {
//     const { name, email, password, role = 'Staff', phone } = req.body;
//     if (!name || !email || !password) return res.status(400).json({ error: 'name,email,password required' });
//     const exists = await User.findOne({ where: { email } });
//     if (exists) return res.status(400).json({ error: 'Email already in use' });
//     const hashed = await bcrypt.hash(password, SALT);
//     const user = await User.create({ id: uuidv4(), name, email, password_hash: hashed, role, phone });
//     res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone } });
//   } catch (err) { next(err); }
// }
export async function createUser(req, res, next) {
  try {
    const { name, email, password, role = 'Staff', phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name,email,password required' });
    }

    const ALLOWED_ROLES = ["Admin", "Staff", "Client", "User"];

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        error: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`
      });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, SALT);

    const user = await User.create({
      name,
      email,
      password_hash: hashed,
      role,
      phone
    });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });

  } catch (err) {
    next(err);
  }
}


// export async function updateUser(req, res, next) {
//   try {
//     const id = req.params.id;
//     const fields = {};
//     const allowed = ['name', 'phone', 'role'];
//     for (const k of allowed) if (req.body[k] !== undefined) fields[k] = req.body[k];
//     if (req.body.password) fields.password_hash = await bcrypt.hash(req.body.password, SALT);
//     const [count] = await User.update(fields, { where: { id } });
//     if (!count) return res.status(404).json({ error: 'User not found' });
//     const user = await User.findByPk(id, { attributes: ['id', 'name', 'email', 'role', 'phone'] });
//     res.json({ user });
//   } catch (err) { next(err); }
// }
export async function updateUser(req, res, next) {
  try {
    const id = req.params.id;

    const fields = {};
    const allowed = ['name', 'phone', 'role'];

    // Add role validation
    const ALLOWED_ROLES = ["Admin", "Staff", "Client", "User"];
    if (req.body.role && !ALLOWED_ROLES.includes(req.body.role)) {
      return res.status(400).json({
        error: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`
      });
    }

    for (const k of allowed) {
      if (req.body[k] !== undefined) fields[k] = req.body[k];
    }

    if (req.body.password) {
      fields.password_hash = await bcrypt.hash(req.body.password, SALT);
    }

    const [count] = await User.update(fields, { where: { id } });
    if (!count) return res.status(404).json({ error: 'User not found' });

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role', 'phone']
    });

    res.json({ user });

  } catch (err) {
    next(err);
  }
}


export async function deleteUser(req, res, next) {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({
      success: false,
      error: 'User not found'
    });
    await user.destroy();
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    })
  }
  catch (err) {
    next(err);
  }
}





