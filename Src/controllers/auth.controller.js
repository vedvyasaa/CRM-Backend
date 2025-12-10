// src/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import userModel from '../models/user.model.js';
import User from "../models/user.model.js";

import { signToken } from '../utils/jwt.js';
import sequelize from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export async function register(req, res) {
  try {
    const { name, email, password, role = "Staff", phone } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password_hash: hashed,
      role,
      phone
    });

    const token = signToken({ id: user.id, role: user.role });

    return res.status(201).json({
      user,
      token
    });

  } catch (err) {
    console.error("register error", err);
    return res.status(500).json({ error: "Server error" });
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: user.id, role: user.role });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      token
    });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ error: "Server error" });
  }
}


export async function me(req, res) {
  res.json({ user: req.user });
}
