/**
 * ============================================================
 * FACT EXTRACTOR — Percept Processing Module
 * ============================================================
 * Classical AI Concept: Percept Processing / Environment Sensing
 *
 * In the Intelligent Agent model:
 *   Environment → Email Text
 *   Percepts     → Extracted features (keywords, links, sender)
 *   Facts        → Structured representation for inference
 *
 * This module converts raw email input into a structured FACT BASE
 * that the Inference Engine can reason over.
 * ============================================================
 */

const { trustedSenders } = require("../rules");

/**
 * Extracts all URLs/links from raw email text.
 * @param {string} rawText - The original (non-cleaned) email text
 * @returns {string[]} - Array of detected URLs
 */
function extractLinks(rawText) {
  const urlPattern = /https?:\/\/[^\s,)>"']+|www\.[^\s,)>"']+/gi;
  return rawText.match(urlPattern) || [];
}

/**
 * Normalises and tokenises the email text.
 * Steps:
 *  1. Lowercase everything
 *  2. Remove non-alphanumeric characters (keep spaces)
 *  3. Split into tokens (words)
 *  4. Remove very short tokens (< 2 chars) and common stop-words
 *
 * @param {string} text - Raw email body
 * @returns {string[]} - Clean token list
 */
function tokenize(text) {
  const stopWords = new Set([
    "the", "a", "an", "is", "it", "in", "on", "at", "to", "for",
    "of", "and", "or", "but", "not", "with", "this", "that", "are",
    "was", "be", "as", "by", "from", "your", "you", "we", "i",
    "have", "has", "had", "do", "does", "will", "can", "may",
    "my", "our", "their", "its", "if", "so", "up", "out", "about",
    "more", "also", "just", "been", "than", "which", "there", "here",
    "they", "them", "he", "she", "his", "her", "him", "who",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")  // Remove punctuation
    .split(/\s+/)                   // Split on whitespace
    .filter((token) => token.length >= 2 && !stopWords.has(token));
}

/**
 * extractFacts — Main percept-to-fact conversion function.
 *
 * Classical AI Concept: This is the SENSOR of our intelligent agent.
 * It perceives the environment (email) and converts raw signals into
 * structured facts used by the inference engine.
 *
 * @param {string} emailText  - The email body text
 * @param {string} [sender]   - Optional sender email address
 * @returns {Object} facts    - Structured fact base
 */
function extractFacts(emailText, sender = "") {
  // console.log("\n════════════════════════════════════════════════");
  // console.log("  FACT EXTRACTOR — Percept Processing");
  // console.log("════════════════════════════════════════════════");
  // console.log(`📨 Raw Input (${emailText.length} chars): "${emailText.substring(0, 80)}..."`);

  // ── STEP 1: Extract links before cleaning (links may be stripped) ──
  const links = extractLinks(emailText);
  const link_count = links.length;
  // console.log(`🔗 Links detected (${link_count}): ${JSON.stringify(links)}`);

  // ── STEP 2: Tokenize ────────────────────────────────────────────
  const tokens = tokenize(emailText);
  // console.log(`🔤 Tokens extracted: [${tokens.join(", ")}]`);

  // ── STEP 3: Build contains set (unique keywords) ────────────────
  const contains = [...new Set(tokens)]; // deduplicate
  // console.log(`📌 Unique keywords (facts): [${contains.join(", ")}]`);

  // ── STEP 4: Check trusted sender ────────────────────────────────
  const normalizedSender = sender.trim().toLowerCase();
  const trusted_sender =
    normalizedSender.length > 0 &&
    trustedSenders.some((trusted) => trusted.toLowerCase() === normalizedSender);
  // console.log(`👤 Sender: "${sender}" → Trusted: ${trusted_sender}`);

  // ── STEP 5: Assemble fact base ───────────────────────────────────
  const facts = {
    raw_text: emailText,
    tokens,
    contains,       // contains("word") facts
    link_count,     // link_count > N facts
    links,
    sender: normalizedSender,
    trusted_sender, // trusted_sender = true/false
    word_count: tokens.length,
    char_count: emailText.length,
    // Dynamic inference engine signals (populated during FC execution):
    spam_signals: 0,
    not_spam_signals: 0,
  };

  // console.log(`\n✅ Fact base assembled:`);
  // console.log(`   contains:       [${contains.join(", ")}]`);
  // console.log(`   link_count:     ${link_count}`);
  // console.log(`   trusted_sender: ${trusted_sender}`);
  // console.log(`   word_count:     ${facts.word_count}`);

  return facts;
}

module.exports = { extractFacts };
