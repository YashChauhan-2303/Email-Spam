/**
 * ============================================================
 * API ROUTES — Spam Classification Agent
 * ============================================================
 */

const express = require("express");
const router = express.Router();
const { analyzeEmail } = require("../controllers/spamController");

/**
 * POST /api/analyze
 * Analyzes email text using the rule-based forward-chaining agent.
 * Body: { emailText: string, sender?: string }
 */
router.post("/analyze", analyzeEmail);

/**
 * GET /api/health
 * Health check endpoint.
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    agent: "Rule-Based Intelligent Agent for Email Spam Classification",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/rules
 * Returns the current knowledge base (rules list) for inspection.
 */
router.get("/rules", (req, res) => {
  const { rules, heuristicScores, SPAM_SCORE_THRESHOLD } = require("../rules");
  res.json({
    total_rules: rules.length,
    spam_threshold: SPAM_SCORE_THRESHOLD,
    rules: rules.map((r) => ({
      id: r.id,
      name: r.name,
      conclusion: r.conclusion,
      score: r.score,
      explanation: r.explanation,
    })),
    heuristic_keywords: heuristicScores,
  });
});

module.exports = router;
