/**
 * keys.js -- API Key Management Routes for Drishti (MongoDB)
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
const { ApiKey, UsageLog } = require("./db");
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
router.post("/", async (req, res) => {
  try {
    const { label } = req.body;
    const userId = req.user.id;

    // Limit: max 5 keys per user
    const keyCount = await ApiKey.countDocuments({ user_id: userId });
    if (keyCount >= 5) {
      return res.status(400).json({
        error: "Maximum 5 API keys per account. Revoke an existing key first.",
      });
    }

    const key = generateApiKey();
    const keyLabel = label || "Default";

    const apiKey = await ApiKey.create({
      user_id: userId,
      key,
      label: keyLabel,
    });

    console.log(`[keys] New API key generated for user ${userId}: ${key.substring(0, 12)}...`);

    return res.status(201).json({
      message: "API key created",
      apiKey: {
        id: apiKey._id,
        key,
        label: keyLabel,
        requestsCount: 0,
        requestsLimit: 1000,
        isActive: true,
        createdAt: apiKey.created_at,
      },
    });
  } catch (err) {
    console.error("[keys] Create error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// ── GET /keys -- List user's API keys ──────────
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const keys = await ApiKey.find({ user_id: userId }).sort({ created_at: -1 });

    const formatted = keys.map((k) => ({
      id: k._id,
      key: k.key,
      label: k.label,
      requestsCount: k.requests_count,
      requestsLimit: k.requests_limit,
      isActive: k.is_active,
      createdAt: k.created_at,
      maskedKey: k.key.substring(0, 8) + "..." + k.key.substring(k.key.length - 4),
    }));

    return res.json({
      total: formatted.length,
      keys: formatted,
    });
  } catch (err) {
    console.error("[keys] List error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// ── DELETE /keys/:id -- Revoke an API key ──────
router.delete("/:id", async (req, res) => {
  try {
    const keyId = req.params.id;
    const userId = req.user.id;

    const key = await ApiKey.findOne({ _id: keyId, user_id: userId });
    if (!key) {
      return res.status(404).json({ error: "API key not found" });
    }

    key.is_active = false;
    await key.save();

    console.log(`[keys] API key revoked: ${key.key.substring(0, 12)}...`);

    return res.json({ message: "API key revoked successfully" });
  } catch (err) {
    console.error("[keys] Revoke error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// ── GET /keys/:id/usage -- Usage details ───────
router.get("/:id/usage", async (req, res) => {
  try {
    const keyId = req.params.id;
    const userId = req.user.id;

    const key = await ApiKey.findOne({ _id: keyId, user_id: userId });
    if (!key) {
      return res.status(404).json({ error: "API key not found" });
    }

    // Get recent usage logs (last 100)
    const logs = await UsageLog.find({ api_key_id: keyId })
      .sort({ timestamp: -1 })
      .limit(100)
      .select("endpoint timestamp");

    // Get per-endpoint breakdown
    const breakdown = await UsageLog.aggregate([
      { $match: { api_key_id: key._id } },
      { $group: { _id: "$endpoint", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { endpoint: "$_id", count: 1, _id: 0 } },
    ]);

    return res.json({
      keyId: key._id,
      label: key.label,
      totalRequests: key.requests_count,
      limit: key.requests_limit,
      remaining: Math.max(0, key.requests_limit - key.requests_count),
      isActive: key.is_active,
      breakdown,
      recentLogs: logs,
    });
  } catch (err) {
    console.error("[keys] Usage error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
