/**
 * ============================================================
 * SPAM ANALYSIS CONTROLLER
 * ============================================================
 * Orchestrates the agent pipeline:
 *   Email Input → Fact Extraction → Inference Engine → Response
 *
 * This controller acts as the AGENT PROGRAM in the Intelligent
 * Agent architecture: it receives percepts and maps them to actions.
 * ============================================================
 */

const { extractFacts } = require("../services/factExtractor");
const { runInferenceEngine } = require("../inferenceEngine");

/**
 * analyzeEmail — Main controller action.
 * POST /api/analyze
 *
 * @param {Request}  req - Express request (body: { emailText, sender })
 * @param {Response} res - Express response
 */
async function analyzeEmail(req, res) {
  try {
    const { emailText, sender = "" } = req.body;

    // ── Input Validation ───────────────────────────────────────────
    if (!emailText || typeof emailText !== "string" || emailText.trim().length === 0) {
      return res.status(400).json({
        error: "Invalid input: emailText is required and must be a non-empty string.",
      });
    }

    if (emailText.trim().length < 3) {
      return res.status(400).json({
        error: "Email text is too short to analyze. Please provide at least 3 characters.",
      });
    }

    // console.log("\n╔══════════════════════════════════════════════════╗");
    // console.log("║     INTELLIGENT AGENT — EMAIL ANALYSIS START     ║");
    // console.log("╚══════════════════════════════════════════════════╝");
    // console.log(`Sender: "${sender}" | Text length: ${emailText.length} chars`);

    // ── AGENT STEP 1: Sense — Extract facts from the environment ──
    const facts = extractFacts(emailText.trim(), sender.trim());

    // ── AGENT STEP 2: Reason — Run forward-chaining inference ──────
    const inferenceResult = runInferenceEngine(facts);

    // ── AGENT STEP 3: Act — Assemble and return structured response ─
    const response = {
      result: inferenceResult.result,                    // "SPAM" | "NOT_SPAM"
      triggered_rules: inferenceResult.triggered_rules,  // Array of fired rules
      explanation: inferenceResult.explanation,          // Human-readable reasons
      heuristic: inferenceResult.heuristic,              // Score-based analysis
      decision_method: inferenceResult.decision_method,  // How decision was made
      facts_summary: {
        keywords_detected: facts.contains,
        link_count: facts.link_count,
        word_count: facts.word_count,
        trusted_sender: facts.trusted_sender,
        sender: facts.sender || "not provided",
      },
    };

    // console.log(`\n📤 Response sent: result=${response.result}, rules_triggered=${response.triggered_rules.length}`);
    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error in analyzeEmail controller:", error);
    return res.status(500).json({
      error: "Internal server error during email analysis.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

module.exports = { analyzeEmail };
