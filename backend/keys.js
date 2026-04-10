/**
 * keys.js -- API Key Management Routes for Drishti
 *
 * All routes require JWT authentication.
 *
 * POST   /keys        - Generate new API key
 * GET    /keys        - List user's API keys with stats
 * DELETE /keys/:id    - Revoke (deactivate) an API key
 * GET    /keys/:id/usage - Detailed usage log for a key
 */

const express = require("express");
const crypto = require("crypto");
const db = require("./db");
const { authenticate } = require("./auth");

const router = express.Router();

// All key routes require authentication
router.use(authenticate);

// ── Helper: generate a unique API key ──────────
function generateApiKey() {
  // Format: dsk_<32 hex chars> (dsk = drishti secret key)
  return "dsk_" + crypto.randomBytes(16).toString("hex");
}

// ── POST /keys -- Generate new API key ─────────
router.post("/", (req, res) => {
  const { label } = req.body;
  const userId = req.user.id;

  // Limit: max 5 keys per user
  const keyCount = db.prepare("SELECT COUNT(*) as count FROM api_keys WHERE user_id = ?")
    .get(userId).count;

  if (keyCount >= 5) {
    return res.status(400).json({
      error: "Maximum 5 API keys per account. Revoke an existing key first.",
    });
  }

  const key = generateApiKey();
  const keyLabel = label || "Default";

  const result = db.prepare(
    "INSERT INTO api_keys (user_id, key, label) VALUES (?, ?, ?)"
  ).run(userId, key, keyLabel);

  console.log(`[keys] New API key generated for user ${userId}: ${key.substring(0, 12)}...`);

  return res.status(201).json({
    message: "API key created",
    apiKey: {
      id: result.lastInsertRowid,
      key,
      label: keyLabel,
      requestsCount: 0,
      requestsLimit: 1000,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  });
});

// ── GET /keys -- List user's API keys ──────────
router.get("/", (req, res) => {
  const userId = req.user.id;

  const keys = db.prepare(`
    SELECT id, key, label, requests_count, requests_limit, is_active, created_at
    FROM api_keys
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId);

  const formatted = keys.map((k) => ({
    id: k.id,
    key: k.key,
    label: k.label,
    requestsCount: k.requests_count,
    requestsLimit: k.requests_limit,
    isActive: Boolean(k.is_active),
    createdAt: k.created_at,
    // Mask the key for display (show first 8 + last 4 chars)
    maskedKey: k.key.substring(0, 8) + "..." + k.key.substring(k.key.length - 4),
  }));

  return res.json({
    total: formatted.length,
    keys: formatted,
  });
});

// ── DELETE /keys/:id -- Revoke an API key ──────
router.delete("/:id", (req, res) => {
  const keyId = req.params.id;
  const userId = req.user.id;

  // Verify the key belongs to this user
  const key = db.prepare("SELECT * FROM api_keys WHERE id = ? AND user_id = ?")
    .get(keyId, userId);

  if (!key) {
    return res.status(404).json({ error: "API key not found" });
  }

  db.prepare("UPDATE api_keys SET is_active = 0 WHERE id = ?").run(keyId);

  console.log(`[keys] API key revoked: ${key.key.substring(0, 12)}...`);

  return res.json({ message: "API key revoked successfully" });
});

// ── GET /keys/:id/usage -- Usage details ───────
router.get("/:id/usage", (req, res) => {
  const keyId = req.params.id;
  const userId = req.user.id;

  // Verify the key belongs to this user
  const key = db.prepare("SELECT * FROM api_keys WHERE id = ? AND user_id = ?")
    .get(keyId, userId);

  if (!key) {
    return res.status(404).json({ error: "API key not found" });
  }

  // Get recent usage logs (last 100)
  const logs = db.prepare(`
    SELECT endpoint, timestamp
    FROM usage_logs
    WHERE api_key_id = ?
    ORDER BY timestamp DESC
    LIMIT 100
  `).all(keyId);

  // Get per-endpoint breakdown
  const breakdown = db.prepare(`
    SELECT endpoint, COUNT(*) as count
    FROM usage_logs
    WHERE api_key_id = ?
    GROUP BY endpoint
    ORDER BY count DESC
  `).all(keyId);

  return res.json({
    keyId: key.id,
    label: key.label,
    totalRequests: key.requests_count,
    limit: key.requests_limit,
    remaining: Math.max(0, key.requests_limit - key.requests_count),
    isActive: Boolean(key.is_active),
    breakdown,
    recentLogs: logs,
  });
});

module.exports = router;
