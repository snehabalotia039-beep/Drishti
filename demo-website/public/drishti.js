/**
 * ╔══════════════════════════════════════════════════╗
 * ║          Drishti SDK — drishti.js v1.0           ║
 * ║   Plug-and-play AI marketing optimization        ║
 * ╚══════════════════════════════════════════════════╝
 *
 * Usage:
 *   <script>
 *     window.DrishtiConfig = {
 *       apiKey: "demo123",
 *       apiUrl: "http://localhost:5000/analyze",
 *       selectors: { headline: "#headline", cta: "#cta" },
 *       interval: 5000,
 *       enabled: true,
 *       debug: false
 *     };
 *   </script>
 *   <script src="drishti.js"></script>
 */

(function () {
  "use strict";

  // ── Default config ──────────────────────────────
  const DEFAULTS = {
    apiKey: "demo123",
    apiUrl: "http://localhost:5000/analyze",
    selectors: {
      headline: "#headline",
      cta: "#cta",
    },
    interval: 5000,
    enabled: true,
    debug: false,
  };

  // ── Merge user config with defaults ─────────────
  function getConfig() {
    const userConfig = window.DrishtiConfig || {};
    return {
      ...DEFAULTS,
      ...userConfig,
      selectors: { ...DEFAULTS.selectors, ...(userConfig.selectors || {}) },
    };
  }

  // ── Session ID management ───────────────────────
  function getSessionId() {
    let id = sessionStorage.getItem("drishti_session_id");
    if (!id) {
      id = "drishti_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
      sessionStorage.setItem("drishti_session_id", id);
    }
    return id;
  }

  // ── State ───────────────────────────────────────
  const state = {
    sessionId: getSessionId(),
    clicks: 0,
    timeSpent: 0,
    scrollPositions: [],
    scrollSpeed: "medium",
    currentSection: "hero",
    lastSendTime: 0,
    intervalId: null,
    timeIntervalId: null,
    isActive: false,
  };

  // ── Logging helper ──────────────────────────────
  function log(...args) {
    if (getConfig().debug) {
      console.log("[Drishti]", ...args);
    }
  }

  // ── Scroll speed calculation ────────────────────
  let lastScrollY = 0;
  let lastScrollTime = Date.now();
  let scrollDeltas = [];

  function trackScroll() {
    const now = Date.now();
    const deltaY = Math.abs(window.scrollY - lastScrollY);
    const deltaT = now - lastScrollTime;

    if (deltaT > 0 && deltaY > 0) {
      const speed = deltaY / deltaT; // px per ms
      scrollDeltas.push(speed);

      // Keep last 10 measurements
      if (scrollDeltas.length > 10) scrollDeltas.shift();
    }

    lastScrollY = window.scrollY;
    lastScrollTime = now;

    // Detect current section
    detectSection();
  }

  function getScrollSpeed() {
    if (scrollDeltas.length === 0) return "medium";
    const avg = scrollDeltas.reduce((a, b) => a + b, 0) / scrollDeltas.length;
    if (avg > 2) return "fast";
    if (avg < 0.5) return "slow";
    return "medium";
  }

  // ── Section detection ───────────────────────────
  function detectSection() {
    const sections = document.querySelectorAll("[data-section]");
    const viewportMiddle = window.scrollY + window.innerHeight / 2;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionBottom = sectionTop + rect.height;

      if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
        state.currentSection = section.getAttribute("data-section");
        break;
      }
    }
  }

  // ── Click tracking ──────────────────────────────
  function trackClick() {
    state.clicks++;
    log("Click detected. Total:", state.clicks);
  }

  // ── DOM update with smooth transition ───────────
  function updateDOM(data) {
    if (!data || !data.change) {
      log("No change needed");
      return;
    }

    const config = getConfig();

    // Update headline
    if (data.headline) {
      const el = document.querySelector(config.selectors.headline);
      if (el) {
        smoothUpdate(el, data.headline, "text");
      }
    }

    // Update CTA
    if (data.cta) {
      const el = document.querySelector(config.selectors.cta);
      if (el) {
        smoothUpdate(el, data.cta, "cta");
      }
    }

    log("DOM updated →", data.reason);
  }

  function smoothUpdate(element, newContent, type) {
    // Don't update if content hasn't changed
    const currentText = element.textContent.trim();
    // For CTA buttons, the text might include icon SVG, so compare more carefully
    if (type === "text" && currentText === newContent) return;

    // Phase 1: Fade out
    element.classList.add("drishti-fade-out");

    setTimeout(() => {
      // Phase 2: Update content
      if (type === "cta") {
        // Preserve any SVG icons in the button — only update text
        const svg = element.querySelector("svg");
        if (svg) {
          // Clear text nodes only
          const textNodes = Array.from(element.childNodes).filter(
            (n) => n.nodeType === Node.TEXT_NODE
          );
          textNodes.forEach((n) => n.remove());
          // Insert new text before the SVG
          element.insertBefore(document.createTextNode(newContent + " "), svg);
        } else {
          element.textContent = newContent;
        }
      } else {
        element.textContent = newContent;
      }

      // Phase 3: Fade in
      element.classList.remove("drishti-fade-out");
      element.classList.add("drishti-fade-in");

      // Phase 4: Pulse effect
      element.classList.add("drishti-updated");
      setTimeout(() => {
        element.classList.remove("drishti-updated");
        element.classList.remove("drishti-fade-in");
      }, 600);
    }, 350); // matches CSS transition duration
  }

  // ── Send data to backend ────────────────────────
  async function sendData() {
    const config = getConfig();

    if (!config.enabled) {
      log("Drishti is disabled");
      return;
    }

    // Throttle: don't send more than once per 2 seconds
    const now = Date.now();
    if (now - state.lastSendTime < 2000) return;
    state.lastSendTime = now;

    state.scrollSpeed = getScrollSpeed();

    const payload = {
      apiKey: config.apiKey,
      sessionId: state.sessionId,
      page: window.location.pathname || "home",
      section: state.currentSection,
      scrollSpeed: state.scrollSpeed,
      timeSpent: state.timeSpent,
      clicks: state.clicks,
      emotion: "neutral", // Phase 5: will be set by emotion detection
    };

    log("Sending →", payload);

    try {
      const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        log("API error:", response.status);
        return;
      }

      const data = await response.json();
      log("Received ←", data);
      updateDOM(data);
    } catch (err) {
      log("Network error:", err.message);
    }
  }

  // ── Start / Stop ────────────────────────────────
  function start() {
    if (state.isActive) return;
    state.isActive = true;

    const config = getConfig();

    // Track scroll
    window.addEventListener("scroll", trackScroll, { passive: true });

    // Track clicks
    document.addEventListener("click", trackClick);

    // Track time
    state.timeIntervalId = setInterval(() => {
      state.timeSpent++;
    }, 1000);

    // Send data periodically
    state.intervalId = setInterval(sendData, config.interval);

    // Send initial data after a short delay
    setTimeout(sendData, 2000);

    log("Started tracking (interval: " + config.interval + "ms)");
  }

  function stop() {
    if (!state.isActive) return;
    state.isActive = false;

    window.removeEventListener("scroll", trackScroll);
    document.removeEventListener("click", trackClick);

    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }

    if (state.timeIntervalId) {
      clearInterval(state.timeIntervalId);
      state.timeIntervalId = null;
    }

    log("Stopped tracking");
  }

  function reset() {
    state.clicks = 0;
    state.timeSpent = 0;
    state.scrollPositions = [];
    scrollDeltas = [];
    state.scrollSpeed = "medium";
    log("State reset");
  }

  // ── Public API ──────────────────────────────────
  window.Drishti = {
    start: start,
    stop: stop,
    reset: reset,
    getState: function () {
      return { ...state, scrollSpeed: getScrollSpeed() };
    },
    setEmotion: function (emotion) {
      // Manual emotion override (for demo)
      state.emotion = emotion;
      log("Emotion set to:", emotion);
    },
    isActive: function () {
      return state.isActive;
    },
    version: "1.0.0",
  };

  // ── Auto-start if enabled ──────────────────────
  function init() {
    const config = getConfig();
    log("Drishti SDK v1.0.0 initialized");
    log("Config:", config);

    if (config.enabled) {
      start();
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
