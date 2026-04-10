/**
 * rules.js — Rule-Based Decision Engine for Drishti
 *
 * Analyzes user behavior data and returns optimized content.
 * Works standalone without AI — this is the fallback + primary logic.
 *
 * Input:  { scrollSpeed, timeSpent, clicks, emotion, page, section }
 * Output: { change, headline, cta, reason }
 */

function analyzeRules(data) {
  const {
    scrollSpeed = "medium",
    timeSpent = 0,
    clicks = 0,
    emotion = "neutral",
    page = "home",
    section = "hero",
  } = data;

  // ─────────────────────────────────────────────
  // EMOTION-BASED RULES (highest priority)
  // ─────────────────────────────────────────────

  if (emotion === "bored") {
    return {
      change: true,
      headline: "Wait — you haven't seen the best part yet!",
      cta: "Show Me ⚡",
      reason: "bored_user_engage",
    };
  }

  if (emotion === "confused") {
    return {
      change: true,
      headline: "Let us guide you — it's simpler than you think",
      cta: "Start Here 🤝",
      reason: "confused_user_guide",
    };
  }

  if (emotion === "love" || emotion === "happy") {
    return {
      change: true,
      headline: "You've got great taste — this one's for you",
      cta: "Grab It Now ❤️",
      reason: "positive_emotion_convert",
    };
  }

  // ─────────────────────────────────────────────
  // BEHAVIOR-BASED RULES
  // ─────────────────────────────────────────────

  // Fast scroll + low time = user about to leave
  if (scrollSpeed === "fast" && timeSpent < 10) {
    return {
      change: true,
      headline: "Still looking? Grab this now!",
      cta: "Buy Now ⚡",
      reason: "low_engagement_fast_scroll",
    };
  }

  // Fast scroll + some time = scanning user
  if (scrollSpeed === "fast" && timeSpent >= 10 && timeSpent < 20) {
    return {
      change: true,
      headline: "Quick picks — our customers' favorites",
      cta: "See Top Picks 🔥",
      reason: "scanning_user_redirect",
    };
  }

  // Long session (30+ seconds) = offer opportunity
  if (timeSpent > 30) {
    return {
      change: true,
      headline: "You've been here a while — here's a deal just for you",
      cta: "Claim Offer 🎁",
      reason: "long_session_offer",
    };
  }

  // Slow engagement + decent time = interested reader
  if (scrollSpeed === "slow" && timeSpent > 20 && timeSpent <= 30) {
    return {
      change: true,
      headline: "Take your time — here's everything you need",
      cta: "Learn More 📖",
      reason: "high_engagement_slow_read",
    };
  }

  // Low clicks + some time = hesitant user
  if (clicks < 2 && timeSpent > 15) {
    return {
      change: true,
      headline: "Not sure? Let us help you decide",
      cta: "Get Help 🤝",
      reason: "low_interaction_assist",
    };
  }

  // Multiple clicks = engaged user → deeper content
  if (clicks >= 3) {
    return {
      change: true,
      headline: "Love exploring? Dive into our full collection",
      cta: "Explore All →",
      reason: "high_interaction_explore",
    };
  }

  // ─────────────────────────────────────────────
  // DEFAULT — no significant signal detected
  // ─────────────────────────────────────────────

  return {
    change: false,
    headline: "Sound that moves with you.",
    cta: "Shop Collection",
    reason: "default",
  };
}

module.exports = { analyzeRules };
