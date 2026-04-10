/**
 * server.js -- Drishti Backend API
 *
 * Express server with:
 * - POST /analyze       -- Behavior analysis + AI decision
 * - POST /detect-emotion -- Webcam emotion proxy
 * - /auth/*             -- User authentication (register, login)
 * - /keys/*             -- API key management
 * - GET /sessions       -- Dashboard session data
 *
 * Port: 5000
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { analyzeRules } = require("./rules");
const { connectDB } = require("./db");
const { authRouter } = require("./auth");
const keysRouter = require("./keys");
const { validateApiKey } = require("./rateLimit");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" })); // increased for base64 frames

// ── Request logging ────────────────────────────
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log(`\n[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    // Don't log full body if it contains a frame (too large)
    if (req.body && req.body.frame) {
      const { frame, ...rest } = req.body;
      console.log("  Body:", JSON.stringify(rest, null, 2));
      console.log("  Frame: [base64 image, " + frame.length + " chars]");
    } else {
      console.log("  Body:", JSON.stringify(req.body, null, 2));
    }
  }
  next();
});

// ── In-memory session store (for dashboard) ──
const sessions = new Map();

// ── Mount auth + key routes ────────────────────
app.use("/auth", authRouter);
app.use("/keys", keysRouter);

// ── Health check ───────────────────────────────
app.get("/", (req, res) => {
  res.json({
    service: "Drishti Decision Engine",
    status: "running",
    version: "3.0.0",
    aiEngine: process.env.AI_SERVICE_URL || "not configured",
    endpoints: {
      analyze: "POST /analyze",
      detectEmotion: "POST /detect-emotion",
      register: "POST /auth/register",
      login: "POST /auth/login",
      me: "GET /auth/me",
      keys: "GET|POST /keys",
      sessions: "GET /sessions",
      health: "GET /",
    },
  });
});

// ── Emotion Detection Proxy ────────────────────
// Proxies webcam frame from SDK → FastAPI AI engine
app.post("/detect-emotion", async (req, res) => {
  const { frame } = req.body;

  if (!frame) {
    return res.status(400).json({
      error: "No frame provided",
      emotion: "neutral",
    });
  }

  const aiUrl = process.env.AI_SERVICE_URL;
  if (!aiUrl) {
    return res.json({
      emotion: "neutral",
      source: "fallback",
      reason: "AI service not configured",
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const aiResponse = await fetch(`${aiUrl}/detect-emotion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frame }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (aiResponse.ok) {
      const data = await aiResponse.json();
      console.log("  [emotion] Detected:", data.emotion);
      return res.json(data);
    } else {
      console.log("  [warn] AI emotion detection failed:", aiResponse.status);
      return res.json({ emotion: "neutral", source: "fallback" });
    }
  } catch (err) {
    console.log("  [warn] Emotion detection error:", err.message);
    return res.json({ emotion: "neutral", source: "fallback" });
  }
});

// ── Main endpoint ──────────────────────────────
// POST /analyze
//
// Accepts the flat data contract:
// {
//   apiKey, sessionId, page, section,
//   scrollSpeed, timeSpent, clicks, emotion,
//   frame (optional base64 webcam frame)
// }
//
// Returns:
// {
//   change, headline, cta, reason, emotion,
//   confidence, contentType, priority, showPopup, reasoning
// }
app.post("/analyze", validateApiKey, async (req, res) => {
  const {
    sessionId,
    page,
    section,
    scrollSpeed,
    timeSpent,
    clicks,
    emotion,
    frame,
  } = req.body;

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

  // ── Run rule-based analysis (always runs as fallback) ──
  const ruleResult = analyzeRules(behaviorData);

  // ── Try AI Smart Decision ──
  let result = ruleResult;
  const aiUrl = process.env.AI_SERVICE_URL;

  if (aiUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s for smart decision

      // Build smart decision payload
      const smartPayload = {
        ...behaviorData,
      };

      // Include webcam frame if provided
      if (frame) {
        smartPayload.frame = frame;
      }

      const aiResponse = await fetch(`${aiUrl}/smart-decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smartPayload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        result = {
          change: aiData.change !== undefined ? aiData.change : true,
          headline: aiData.headline || ruleResult.headline,
          cta: aiData.cta || ruleResult.cta,
          reason: aiData.userType || ruleResult.reason,
          emotion: aiData.emotion || behaviorData.emotion,
          emotionSource: aiData.emotionSource || "manual",
          confidence: aiData.confidence || 0.5,
          contentType: aiData.contentType || "normal",
          priority: aiData.priority || "default",
          showPopup: aiData.showPopup || false,
          reasoning: aiData.reasoning || "",
          source: "smart_ai",
        };
        console.log("  [ai] Smart AI decision");
        console.log("    Emotion:", result.emotion, `(${result.emotionSource})`);
        console.log("    User type:", result.reason);
        console.log("    Confidence:", result.confidence);
      } else {
        // Fall back to basic /generate endpoint
        console.log("  [warn] Smart decide failed, trying /generate...");
        try {
          const genResponse = await fetch(`${aiUrl}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(behaviorData),
          });

          if (genResponse.ok) {
            const genData = await genResponse.json();
            result = {
              ...ruleResult,
              headline: genData.headline || ruleResult.headline,
              cta: genData.cta || ruleResult.cta,
              emotion: genData.emotion || behaviorData.emotion,
              confidence: genData.confidence || 0.5,
              source: "ai",
            };
            console.log("  [ai] AI enhanced (basic)");
          }
        } catch {
          console.log("  AI /generate also unavailable, using rules");
        }
      }
    } catch (err) {
      // AI unavailable — fall back to rules silently
      console.log("  AI unavailable, using rules:", err.message);
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
    emotion: result.emotion || emotion,
    emotionSource: result.emotionSource || "manual",
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
  console.log("  Result:", JSON.stringify({
    headline: result.headline,
    cta: result.cta,
    emotion: result.emotion,
    reason: result.reason,
    confidence: result.confidence,
    source: result.source,
  }));

  return res.json(result);
});

// ── Sessions endpoint (for dashboard) ──
app.get("/sessions", (req, res) => {
  const allSessions = {};
  for (const [id, history] of sessions) {
    allSessions[id] = {
      totalInteractions: history.length,
      lastSeen: history[history.length - 1]?.timestamp,
      lastAction: history[history.length - 1]?.result?.reason,
      lastEmotion: history[history.length - 1]?.emotion,
      emotionSource: history[history.length - 1]?.emotionSource,
      history: history.slice(-10), // last 10 entries
    };
  }
  return res.json({
    activeSessions: sessions.size,
    sessions: allSessions,
  });
});

// ── Start server (connect to MongoDB first) ────
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\nDrishti Decision Engine v3.0 running on http://localhost:${PORT}`);
    console.log(`   POST /auth/register  -- Create account`);
    console.log(`   POST /auth/login     -- Login, get JWT`);
    console.log(`   GET  /auth/me        -- Profile (JWT required)`);
    console.log(`   POST /keys           -- Generate API key (JWT required)`);
    console.log(`   GET  /keys           -- List API keys (JWT required)`);
    console.log(`   POST /analyze        -- Behavior analysis + AI`);
    console.log(`   POST /detect-emotion -- Webcam emotion proxy`);
    console.log(`   GET  /sessions       -- Dashboard data`);
    console.log(`   AI Service:          ${process.env.AI_SERVICE_URL || "not configured"}\n`);
  });
}

start();
