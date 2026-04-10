/**
 * auth.js -- Authentication Routes for Drishti
 *
 * POST /auth/register  - Create account
 * POST /auth/login     - Login, returns JWT
 * GET  /auth/me        - Get current user profile
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "drishti_secret_key_change_in_production";
const JWT_EXPIRES_IN = "7d";

// ── Helper: generate JWT ───────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// ── Middleware: verify JWT ──────────────────────
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ── POST /auth/register ────────────────────────
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  // Check if email already exists
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  // Insert user
  const result = db.prepare(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
  ).run(name, email, passwordHash);

  const user = { id: result.lastInsertRowid, name, email };
  const token = generateToken(user);

  console.log(`[auth] New user registered: ${email}`);

  return res.status(201).json({
    message: "Account created successfully",
    user: { id: user.id, name, email },
    token,
  });
});

// ── POST /auth/login ───────────────────────────
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken(user);

  console.log(`[auth] User logged in: ${email}`);

  return res.json({
    message: "Login successful",
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

// ── GET /auth/me ───────────────────────────────
router.get("/me", authenticate, (req, res) => {
  const user = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?")
    .get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Count user's API keys
  const keyCount = db.prepare("SELECT COUNT(*) as count FROM api_keys WHERE user_id = ?")
    .get(user.id).count;

  return res.json({
    ...user,
    apiKeyCount: keyCount,
  });
});

module.exports = { authRouter: router, authenticate };
