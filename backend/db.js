/**
 * db.js -- SQLite Database Setup for Drishti
 *
 * Tables:
 *   users     - registered users
 *   api_keys  - API keys per user with request limits
 *   usage_logs - per-request log for tracking
 */

const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "drishti.db");
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma("journal_mode = WAL");

// ── Create tables ──────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    key TEXT UNIQUE NOT NULL,
    label TEXT DEFAULT 'Default',
    requests_count INTEGER DEFAULT 0,
    requests_limit INTEGER DEFAULT 1000,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS usage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key_id INTEGER NOT NULL,
    endpoint TEXT NOT NULL,
    timestamp TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id)
  );

  CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
  CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
  CREATE INDEX IF NOT EXISTS idx_usage_logs_key ON usage_logs(api_key_id);
`);

module.exports = db;
