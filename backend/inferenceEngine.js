/**
 * ============================================================
 * INFERENCE ENGINE — Forward Chaining Algorithm
 * ============================================================
 * Classical AI Concept: Forward Chaining (Data-Driven Inference)
 *
 * Algorithm:
 *   1. Start with the initial FACT BASE extracted from the email
 *   2. Loop through every rule in the KNOWLEDGE BASE
 *   3. For each rule, evaluate ALL conditions against the facts
 *   4. If ALL conditions are satisfied → FIRE the rule
 *   5. Add the rule's conclusion to the fact base (monotonic)
 *   6. Continue until no new rules fire (fixed-point / agenda exhausted)
 *   7. Determine final classification from accumulated conclusions
 *
 * This implements the RETE-inspired pattern-matching loop used in
 * expert systems like CLIPS and Prolog.
 * ============================================================
 */

const { rules, heuristicScores, SPAM_SCORE_THRESHOLD } = require("./rules");

/**
 * runForwardChaining — Core inference algorithm.
 *
 * @param {Object} facts - The initial fact base extracted from the email
 * @returns {Object} - Inference result with decision, triggered rules, and explanation
 *
 * Classical AI Concept: The AGENDA in forward chaining is the list of
 * rules whose conditions are satisfied but have not yet been fired.
 */
function runForwardChaining(facts) {
  // console.log("\n════════════════════════════════════════════════");
  // console.log("  INFERENCE ENGINE — FORWARD CHAINING START");
  // console.log("════════════════════════════════════════════════");
  // console.log("📋 Initial Fact Base:", JSON.stringify(facts, null, 2));

  const triggeredRules = [];
  const explanation = [];
  const firedRuleIds = new Set(); // Prevent the same rule from firing twice
  let spamConclusions = 0;
  let notSpamConclusions = 0;
  let promotionalConclusions = 0;
  let changed = true; // Forward chaining iterates until no new facts are added

  // ── FORWARD CHAINING LOOP ──────────────────────────────────────
  // Each iteration is called a "cycle". We keep iterating until
  // the fact base reaches a FIXED POINT (no new facts added).
  let cycle = 0;
  while (changed) {
    changed = false;
    cycle++;
    // console.log(`\n🔄 Cycle ${cycle}: Evaluating ${rules.length} rules against fact base...`);

    for (const rule of rules) {
      // Skip already-fired rules (avoid infinite loops / redundant firing)
      if (firedRuleIds.has(rule.id)) continue;

      // console.log(`  ├─ Evaluating Rule [${rule.id}] "${rule.name}"...`);

      // ── CONDITION MATCHING ───────────────────────────────────────
      // All conditions must be TRUE for the rule to fire (AND semantics)
      const allConditionsMet = rule.conditions.every((conditionFn) => {
        try {
          return conditionFn(facts);
        } catch {
          return false;
        }
      });

      if (allConditionsMet) {
        // ── RULE FIRING ─────────────────────────────────────────────
        // console.log(`  │   ✅ FIRED: Rule [${rule.id}] → Conclusion: ${rule.conclusion}`);
        firedRuleIds.add(rule.id);
        triggeredRules.push({
          id: rule.id,
          name: rule.name,
          conclusion: rule.conclusion,
          score: rule.score,
          explanation: rule.explanation,
        });

        explanation.push(`[${rule.id}] ${rule.name}: ${rule.explanation}`);

        // ── FACT BASE UPDATE ─────────────────────────────────────────
        // Fired rule injects new facts into the working memory
        if (rule.conclusion === "SPAM") {
          spamConclusions++;
          facts.spam_signals = (facts.spam_signals || 0) + 1;
        } else if (rule.conclusion === "NOT_SPAM") {
          notSpamConclusions++;
          facts.not_spam_signals = (facts.not_spam_signals || 0) + 1;
        } else if (rule.conclusion === "PROMOTIONAL") {
          promotionalConclusions++;
          facts.promotional_signals = (facts.promotional_signals || 0) + 1;
        }

        changed = true; // New fact added → continue another cycle
      } else {
        // console.log(`  │   ❌ Not triggered: [${rule.id}]`);
      }
    }
  }

  // console.log(`\n📊 Forward chaining completed in ${cycle} cycle(s).`);
  // console.log(`   SPAM rule conclusions:        ${spamConclusions}`);
  // console.log(`   PROMOTIONAL rule conclusions: ${promotionalConclusions}`);
  // console.log(`   NOT_SPAM rule conclusions:    ${notSpamConclusions}`);

  // ── CONFLICT RESOLUTION ────────────────────────────────────────
  let primaryResult;
  if (spamConclusions > 0) {
    primaryResult = "SPAM";
  } else if (promotionalConclusions > 0) {
    primaryResult = "PROMOTIONAL";
  } else {
    primaryResult = "NOT_SPAM";
  }

  // console.log(`\n🏁 Primary Forward-Chaining Result: ${primaryResult}`);
  return { primaryResult, triggeredRules, explanation, firedRuleIds };
}

/**
 * computeHeuristicScore — Bonus heuristic scoring.
 *
 * Classical AI Concept: Heuristic evaluation function.
 * Assigns numeric weights to keyword presence and uses a
 * threshold to make a secondary classification decision.
 *
 * @param {Object} facts - The fact base
 * @returns {Object} - { score, breakdown }
 */
function computeHeuristicScore(facts) {
  // console.log("\n📐 Computing heuristic spam score...");
  let score = 0;
  const breakdown = [];

  for (const keyword of facts.contains) {
    if (heuristicScores[keyword] !== undefined) {
      score += heuristicScores[keyword];
      breakdown.push({ keyword, points: heuristicScores[keyword] });
      // console.log(`   ➕ "${keyword}" → +${heuristicScores[keyword]} points`);
    }
  }

  // Additional penalty for excessive links
  if (facts.link_count > 2) {
    const linkPenalty = facts.link_count * 1;
    score += linkPenalty;
    breakdown.push({ keyword: `${facts.link_count} links detected`, points: linkPenalty });
    // console.log(`   ➕ ${facts.link_count} links → +${linkPenalty} points`);
  }

  // console.log(`   📊 Total Heuristic Score: ${score} (Threshold: ${SPAM_SCORE_THRESHOLD})`);
  return { score, breakdown };
}

/**
 * runInferenceEngine — Top-level orchestrator.
 *
 * Combines:
 *   1. Forward Chaining (rule-based classification)
 *   2. Heuristic Scoring (optional confidence metric)
 *
 * @param {Object} facts - Extracted facts from the email
 * @returns {Object} - Final classification result
 */
function runInferenceEngine(facts) {
  // ── STEP 1: Forward Chaining ───────────────────────────────────
  const { primaryResult, triggeredRules, explanation } = runForwardChaining(facts);

  // ── STEP 2: Heuristic Scoring ──────────────────────────────────
  const { score: heuristicScore, breakdown: scoreBreakdown } = computeHeuristicScore(facts);
  const heuristicResult = heuristicScore >= SPAM_SCORE_THRESHOLD ? "SPAM" : "NOT_SPAM";

  // console.log(`\n⚖️  Heuristic decision: ${heuristicResult} (score=${heuristicScore}, threshold=${SPAM_SCORE_THRESHOLD})`);

  // ── STEP 3: Final Decision (Consensus) ────────────────────────
  // Forward chaining is the primary authority.
  // Heuristic acts as a tiebreaker when forward chaining yields NOT_SPAM
  // but the score is high — catches edge cases not covered by explicit rules.
  let finalResult;
  let decisionMethod;

  if (primaryResult === "SPAM") {
    finalResult = "SPAM";
    decisionMethod = "Forward Chaining";
  } else if (primaryResult === "PROMOTIONAL") {
    finalResult = "PROMOTIONAL";
    decisionMethod = "Forward Chaining";
  } else if (primaryResult === "NOT_SPAM" && heuristicResult === "SPAM") {
    finalResult = "SPAM";
    decisionMethod = "Heuristic Scoring (override)";
    explanation.push(`Heuristic score ${heuristicScore} exceeded threshold ${SPAM_SCORE_THRESHOLD} — classified as SPAM.`);
  } else {
    finalResult = "NOT_SPAM";
    decisionMethod = triggeredRules.length > 0 ? "Forward Chaining" : "Default (no rules triggered)";
  }

  // console.log(`\n✅ FINAL DECISION: ${finalResult} (via ${decisionMethod})`);
  // console.log("════════════════════════════════════════════════\n");

  return {
    result: finalResult,
    triggered_rules: triggeredRules,
    explanation,
    heuristic: {
      score: heuristicScore,
      threshold: SPAM_SCORE_THRESHOLD,
      result: heuristicResult,
      breakdown: scoreBreakdown,
    },
    decision_method: decisionMethod,
  };
}

module.exports = { runInferenceEngine };
