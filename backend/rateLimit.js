/**
 * rateLimit.js -- API Key Validation + Rate Limiting for Drishti (MongoDB)
 *
 * Middleware that:
 * 1. Looks up the API key in MongoDB
 * 2. Checks if the key is active
 * 3. Checks if under the request limit
 * 4. Increments request count + logs usage
 *
 * Also accepts "demo123" as a built-in demo key (no tracking).
 */

const { ApiKey, UsageLog } = require("./db");

async function validateApiKey(req, res, next) {
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

  try {
    // Look up key in MongoDB
    const keyRecord = await ApiKey.findOne({ key: apiKey });

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

    await ApiKey.updateOne(
      { _id: keyRecord._id },
      { $inc: { requests_count: 1 } }
    );

    await UsageLog.create({
      api_key_id: keyRecord._id,
      endpoint,
    });

    req.apiKeyData = {
      id: keyRecord._id,
      userId: keyRecord.user_id,
      remaining: keyRecord.requests_limit - keyRecord.requests_count - 1,
    };

    next();
  } catch (err) {
    console.error("[rateLimit] Error:", err.message);
    return res.status(500).json({ error: "Server error", change: false });
  }
}

module.exports = { validateApiKey };
