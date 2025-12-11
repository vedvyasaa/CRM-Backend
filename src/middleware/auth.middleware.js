import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("auth middleware", err);
    return res.status(401).json({ error: "Authentication failed" });
  }
}

export function permit(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });

    next();
  };
}
