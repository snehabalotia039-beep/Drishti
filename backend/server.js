/**
 * server.js — Drishti Backend API
 *
 * Express server with POST /analyze endpoint.
 * Uses rule-based logic (rules.js) as the decision engine.
 * In Phase 5, will optionally call FastAPI AI service for enhanced content.
 *
 * Port: 5000
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { analyzeRules } = require("./rules");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Request logging ────────────────────────────
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log(`\n[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    console.log("  Body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// ── In-memory session store (for Phase 6 dashboard) ──
const sessions = new Map();

// ── Health check ───────────────────────────────
app.get("/", (req, res) => {
  res.json({
    service: "Drishti Decision Engine",
    status: "running",
    version: "1.0.0",
    endpoints: {
      analyze: "POST /analyze",
      sessions: "GET /sessions",
      health: "GET /",
    },
  });
});

// ── Main endpoint ──────────────────────────────
// POST /analyze
//
// Accepts the flat data contract:
// {
//   apiKey, sessionId, page, section,
//   scrollSpeed, timeSpent, clicks, emotion
// }
//
// Returns:
// {
//   change, headline, cta, reason
// }
app.post("/analyze", async (req, res) => {
  const {
    apiKey,
    sessionId,
    page,
    section,
    scrollSpeed,
    timeSpent,
    clicks,
    emotion,
  } = req.body;

  // ── Validate API key ──
  const validKeys = ["demo123", process.env.API_KEY].filter(Boolean);
  if (!apiKey || !validKeys.includes(apiKey)) {
    return res.status(401).json({
      error: "Invalid API key",
      change: false,
    });
  }

  // ── Validate required fields ──
  if (!sessionId) {
    return res.status(400).json({
      error: "sessionId is required",
      change: false,
    });
  }

  const behaviorData = {
    scrollSpeed: scrollSpeed || "medium",
    timeSpent: timeSpent || 0,
    clicks: clicks || 0,
    emotion: emotion || "neutral",
    page: page || "home",
    section: section || "hero",
  };

  // ── Run rule-based analysis (always runs) ──
  const ruleResult = analyzeRules(behaviorData);

  // ── Try AI service for enhanced content ──
  let result = ruleResult;
  const aiUrl = process.env.AI_SERVICE_URL;

  if (aiUrl && ruleResult.change) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const aiResponse = await fetch(`${aiUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(behaviorData),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        result = {
          ...ruleResult,
          headline: aiData.headline || ruleResult.headline,
          cta: aiData.cta || ruleResult.cta,
          source: "ai",
        };
        console.log("  AI enhanced ✨");
      }
    } catch (err) {
      // AI unavailable — fall back to rules silently
      console.log("  AI unavailable, using rules");
    }
  }

  // ── Store session data (for dashboard) ──
  const sessionData = {
    sessionId,
    page,
    section,
    scrollSpeed,
    timeSpent,
    clicks,
    emotion,
    result,
    timestamp: new Date().toISOString(),
  };

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  const history = sessions.get(sessionId);
  history.push(sessionData);
  // Keep only last 50 entries per session
  if (history.length > 50) history.shift();

  // ── Log response ──
  console.log("  Result:", JSON.stringify(result));

  return res.json(result);
});

// ── Sessions endpoint (for Phase 6 dashboard) ──
app.get("/sessions", (req, res) => {
  const allSessions = {};
  for (const [id, history] of sessions) {
    allSessions[id] = {
      totalInteractions: history.length,
      lastSeen: history[history.length - 1]?.timestamp,
      lastAction: history[history.length - 1]?.result?.reason,
      history: history.slice(-10), // last 10 entries
    };
  }
  return res.json({
    activeSessions: sessions.size,
    sessions: allSessions,
  });
});

// ── Start server ───────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔮 Drishti Decision Engine running on http://localhost:${PORT}`);
  console.log(`   POST /analyze  — Analyze user behavior`);
  console.log(`   GET  /sessions — View session data`);
  console.log(`   GET  /         — Health check\n`);
});
