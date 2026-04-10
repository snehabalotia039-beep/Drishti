/**
 * test.js — Test all rule branches of the Drishti decision engine
 * Run: node test.js
 */

const BASE = "http://localhost:5000/analyze";

const tests = [
  {
    name: "Fast scroll + low time → low_engagement_fast_scroll",
    body: { apiKey: "demo123", sessionId: "test_1", page: "product", section: "hero", scrollSpeed: "fast", timeSpent: 5, clicks: 0, emotion: "neutral" },
    expect: "low_engagement_fast_scroll",
  },
  {
    name: "Bored emotion → bored_user_engage",
    body: { apiKey: "demo123", sessionId: "test_2", page: "product", section: "hero", scrollSpeed: "slow", timeSpent: 10, clicks: 1, emotion: "bored" },
    expect: "bored_user_engage",
  },
  {
    name: "Confused emotion → confused_user_guide",
    body: { apiKey: "demo123", sessionId: "test_3", page: "product", section: "hero", scrollSpeed: "medium", timeSpent: 15, clicks: 1, emotion: "confused" },
    expect: "confused_user_guide",
  },
  {
    name: "Long session (35s) → long_session_offer",
    body: { apiKey: "demo123", sessionId: "test_4", page: "product", section: "hero", scrollSpeed: "slow", timeSpent: 35, clicks: 2, emotion: "neutral" },
    expect: "long_session_offer",
  },
  {
    name: "Low clicks + 18s → low_interaction_assist",
    body: { apiKey: "demo123", sessionId: "test_5", page: "home", section: "hero", scrollSpeed: "medium", timeSpent: 18, clicks: 0, emotion: "neutral" },
    expect: "low_interaction_assist",
  },
  {
    name: "Default (no signal) → default",
    body: { apiKey: "demo123", sessionId: "test_6", page: "home", section: "hero", scrollSpeed: "medium", timeSpent: 5, clicks: 1, emotion: "neutral" },
    expect: "default",
  },
  {
    name: "Love emotion → positive_emotion_convert",
    body: { apiKey: "demo123", sessionId: "test_7", page: "product", section: "hero", scrollSpeed: "slow", timeSpent: 10, clicks: 2, emotion: "love" },
    expect: "positive_emotion_convert",
  },
  {
    name: "Scanning user (fast + 12s) → scanning_user_redirect",
    body: { apiKey: "demo123", sessionId: "test_8", page: "home", section: "hero", scrollSpeed: "fast", timeSpent: 12, clicks: 1, emotion: "neutral" },
    expect: "scanning_user_redirect",
  },
  {
    name: "High clicks (3+) → high_interaction_explore",
    body: { apiKey: "demo123", sessionId: "test_9", page: "home", section: "products", scrollSpeed: "medium", timeSpent: 10, clicks: 4, emotion: "neutral" },
    expect: "high_interaction_explore",
  },
  {
    name: "Slow read (25s) → high_engagement_slow_read",
    body: { apiKey: "demo123", sessionId: "test_10", page: "home", section: "hero", scrollSpeed: "slow", timeSpent: 25, clicks: 1, emotion: "neutral" },
    expect: "high_engagement_slow_read",
  },
];

async function runTests() {
  console.log("\nDrishti Backend — Rule Engine Tests\n");
  console.log("=".repeat(60));

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const res = await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(test.body),
      });
      const data = await res.json();

      const ok = data.reason === test.expect;
      const icon = ok ? "PASS" : "FAIL";

      console.log(`\n${icon} ${test.name}`);
      console.log(`   Expected: ${test.expect}`);
      console.log(`   Got:      ${data.reason}`);
      console.log(`   Headline: "${data.headline}"`);
      console.log(`   CTA:      "${data.cta}"`);
      console.log(`   Change:   ${data.change}`);

      if (ok) passed++;
      else failed++;
    } catch (err) {
      console.log(`\nFAIL ${test.name}`);
      console.log(`   ERROR: ${err.message}`);
      failed++;
    }
  }

  // Test invalid API key
  try {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: "wrong", sessionId: "x" }),
    });
    const ok = res.status === 401;
    const icon = ok ? "PASS" : "FAIL";
    console.log(`\n${icon} Invalid API key -> 401`);
    console.log(`   Status: ${res.status}`);
    if (ok) passed++;
    else failed++;
  } catch (err) {
    console.log(`\nFAIL Invalid API key test — ${err.message}`);
    failed++;
  }

  console.log("\n" + "=".repeat(60));
  console.log(`\nResults: ${passed} passed, ${failed} failed, ${passed + failed} total\n`);
}

runTests();
