/**
 * db.js -- MongoDB Connection for Drishti
 *
 * Connects to MongoDB Atlas using Mongoose.
 * Exports Mongoose models: User, ApiKey, UsageLog
 */

const mongoose = require("mongoose");

// ── Schemas ────────────────────────────────────

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const apiKeySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  key: { type: String, unique: true, required: true },
  label: { type: String, default: "Default" },
  requests_count: { type: Number, default: 0 },
  requests_limit: { type: Number, default: 1000 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

const usageLogSchema = new mongoose.Schema({
  api_key_id: { type: mongoose.Schema.Types.ObjectId, ref: "ApiKey", required: true },
  endpoint: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// ── Indexes ────────────────────────────────────
apiKeySchema.index({ key: 1 });
apiKeySchema.index({ user_id: 1 });
usageLogSchema.index({ api_key_id: 1 });

// ── Models ─────────────────────────────────────
const User = mongoose.model("User", userSchema);
const ApiKey = mongoose.model("ApiKey", apiKeySchema);
const UsageLog = mongoose.model("UsageLog", usageLogSchema);

// ── Connect ────────────────────────────────────
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("[db] MONGO_URI not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("[db] Connected to MongoDB Atlas");
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = { connectDB, User, ApiKey, UsageLog };
