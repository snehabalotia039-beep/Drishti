/**
 * rateLimit.js -- API Key Validation + Rate Limiting for Drishti
 *
 * Middleware that:
 * 1. Looks up the API key in the database
 * 2. Checks if the key is active
 * 3. Checks if under the request limit
 * 4. Increments request count + logs usage
 *
 * Also accepts "demo123" as a built-in demo key (no tracking).
 */

const db = require("./db");

function validateApiKey(req, res, next) {
  const apiKey = req.body.apiKey;

  if (!apiKey) {
    return res.status(401).json({
      error: "API key is required",
      change: false,
    });
  }

  // Allow built-in demo key (no tracking, no limits)
  if (apiKey === "demo123") {
    req.apiKeyData = { demo: true };
    return next();
  }

  // Look up key in database
  const keyRecord = db.prepare(
    "SELECT * FROM api_keys WHERE key = ?"
  ).get(apiKey);

  if (!keyRecord) {
    return res.status(401).json({
      error: "Invalid API key",
      change: false,
    });
  }

  if (!keyRecord.is_active) {
    return res.status(403).json({
      error: "API key has been revoked",
      change: false,
    });
  }

  // Check rate limit
  if (keyRecord.requests_count >= keyRecord.requests_limit) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      limit: keyRecord.requests_limit,
      used: keyRecord.requests_count,
      change: false,
    });
  }

  // Increment count + log usage
  const endpoint = req.path;

  db.prepare("UPDATE api_keys SET requests_count = requests_count + 1 WHERE id = ?")
    .run(keyRecord.id);

  db.prepare("INSERT INTO usage_logs (api_key_id, endpoint) VALUES (?, ?)")
    .run(keyRecord.id, endpoint);

  req.apiKeyData = {
    id: keyRecord.id,
    userId: keyRecord.user_id,
    remaining: keyRecord.requests_limit - keyRecord.requests_count - 1,
  };

  next();
}

module.exports = { validateApiKey };
