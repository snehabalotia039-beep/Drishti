/**
 * server.js — Drishti Backend API
 *
 * Express server with POST /analyze endpoint.
 * Uses rule-based logic (rules.js) as the decision engine.
 * Calls FastAPI AI service for enhanced content + smart decisions.
 * Proxies webcam emotion detection to AI engine.
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

// ── Health check ───────────────────────────────
app.get("/", (req, res) => {
  res.json({
    service: "Drishti Decision Engine",
    status: "running",
    version: "2.0.0",
    aiEngine: process.env.AI_SERVICE_URL || "not configured",
    endpoints: {
      analyze: "POST /analyze",
      detectEmotion: "POST /detect-emotion",
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
      console.log("  🎭 Emotion detected:", data.emotion);
      return res.json(data);
    } else {
      console.log("  ⚠️ AI emotion detection failed:", aiResponse.status);
      return res.json({ emotion: "neutral", source: "fallback" });
    }
  } catch (err) {
    console.log("  ⚠️ Emotion detection error:", err.message);
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
    frame,
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
        console.log("  🧠 Smart AI decision ✨");
        console.log("    Emotion:", result.emotion, `(${result.emotionSource})`);
        console.log("    User type:", result.reason);
        console.log("    Confidence:", result.confidence);
      } else {
        // Fall back to basic /generate endpoint
        console.log("  ⚠️ Smart decide failed, trying /generate...");
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
            console.log("  AI enhanced (basic) ✨");
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

// ── Start server ───────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔮 Drishti Decision Engine v2.0 running on http://localhost:${PORT}`);
  console.log(`   POST /analyze        — Analyze behavior + AI decision`);
  console.log(`   POST /detect-emotion — Webcam emotion detection`);
  console.log(`   GET  /sessions       — View session data`);
  console.log(`   GET  /               — Health check`);
  console.log(`   AI Service:          ${process.env.AI_SERVICE_URL || "not configured"}\n`);
});
