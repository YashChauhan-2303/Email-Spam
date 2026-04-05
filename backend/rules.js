/**
 * ============================================================
 * KNOWLEDGE BASE — Rule-Based Intelligent Agent
 * ============================================================
 * This module represents the KNOWLEDGE BASE of our intelligent
 * agent. Rules are stored as structured IF-THEN objects.
 *
 * Classical AI Concept: Knowledge Representation
 * Each rule has:
 *   - id:         Unique rule identifier
 *   - name:       Human-readable rule name
 *   - conditions: Array of fact predicates (functions)
 *   - conclusion: What to infer when all conditions are met
 *   - score:      Heuristic weight for spam scoring
 *   - explanation:Human-readable reason string
 * ============================================================
 */

const rules = [
  // ── HIGH-CONFIDENCE SPAM RULES ──────────────────────────────
  {
    id: "R01",
    name: "Win + Money Rule",
    conditions: [
      (facts) => facts.contains.includes("win"),
      (facts) => facts.contains.includes("money"),
    ],
    conclusion: "SPAM",
    score: 5,
    explanation: 'Email contains both "win" and "money" — classic lottery scam pattern.',
  },
  {
    id: "R02",
    name: "Free + Offer Rule",
    conditions: [
      (facts) => facts.contains.includes("free"),
      (facts) => facts.contains.includes("offer"),
    ],
    conclusion: "SPAM",
    score: 5,
    explanation: 'Email contains both "free" and "offer" — promotional spam pattern.',
  },
  {
    id: "R03",
    name: "Win + Free Rule",
    conditions: [
      (facts) => facts.contains.includes("win"),
      (facts) => facts.contains.includes("free"),
    ],
    conclusion: "SPAM",
    score: 5,
    explanation: 'Email contains both "win" and "free" — common spam bait wording.',
  },
  {
    id: "R04",
    name: "Urgent + Click Rule",
    conditions: [
      (facts) => facts.contains.includes("urgent"),
      (facts) => facts.contains.includes("click"),
    ],
    conclusion: "SPAM",
    score: 4,
    explanation: 'Email uses urgency combined with a click-bait call-to-action.',
  },
  {
    id: "R05",
    name: "Excessive Links Rule",
    conditions: [(facts) => facts.link_count > 2],
    conclusion: "SPAM",
    score: 4,
    explanation: "Email contains more than 2 hyperlinks — characteristic of phishing/spam.",
  },
  {
    id: "R06",
    name: "Prize + Winner Rule",
    conditions: [
      (facts) => facts.contains.includes("prize"),
      (facts) => facts.contains.includes("winner"),
    ],
    conclusion: "SPAM",
    score: 5,
    explanation: 'Contains "prize" and "winner" — lottery scam pattern.',
  },
  {
    id: "R07",
    name: "Congratulations + Won Rule",
    conditions: [
      (facts) => facts.contains.includes("congratulations"),
      (facts) => facts.contains.includes("won"),
    ],
    conclusion: "SPAM",
    score: 5,
    explanation: '"Congratulations" + "won" is a hallmark of fake prize emails.',
  },
  {
    id: "R08",
    name: "Guaranteed + Income Rule",
    conditions: [
      (facts) => facts.contains.includes("guaranteed"),
      (facts) => facts.contains.includes("income"),
    ],
    conclusion: "SPAM",
    score: 4,
    explanation: '"Guaranteed income" is a common get-rich-quick spam phrase.',
  },
  {
    id: "R09",
    name: "Password + Verify Rule",
    conditions: [
      (facts) => facts.contains.includes("password"),
      (facts) => facts.contains.includes("verify"),
    ],
    conclusion: "SPAM",
    score: 6,
    explanation: 'Asking for password verification is a strong phishing indicator.',
  },
  {
    id: "R10",
    name: "Bank + Account + Update Rule",
    conditions: [
      (facts) => facts.contains.includes("bank"),
      (facts) => facts.contains.includes("account"),
      (facts) => facts.contains.includes("update"),
    ],
    conclusion: "SPAM",
    score: 6,
    explanation: 'Bank + account + update triggers — classic phishing email pattern.',
  },
  {
    id: "R11",
    name: "Free + Money Rule",
    conditions: [
      (facts) => facts.contains.includes("free"),
      (facts) => facts.contains.includes("money"),
    ],
    conclusion: "SPAM",
    score: 5,
    explanation: '"Free money" is a direct spam/scam trigger phrase.',
  },
  {
    id: "R12",
    name: "Limited + Time + Offer Rule",
    conditions: [
      (facts) => facts.contains.includes("limited"),
      (facts) => facts.contains.includes("time"),
      (facts) => facts.contains.includes("offer"),
    ],
    conclusion: "SPAM",
    score: 3,
    explanation: '"Limited time offer" is a pressure-sales spam technique.',
  },
  {
    id: "R13",
    name: "Claim + Reward Rule",
    conditions: [
      (facts) => facts.contains.includes("claim"),
      (facts) => facts.contains.includes("reward"),
    ],
    conclusion: "SPAM",
    score: 4,
    explanation: '"Claim your reward" is a hallmark phrase of spam/scam emails.',
  },
  {
    id: "R14",
    name: "Investment + Profit Rule",
    conditions: [
      (facts) => facts.contains.includes("investment"),
      (facts) => facts.contains.includes("profit"),
    ],
    conclusion: "SPAM",
    score: 4,
    explanation: 'Investment profit promises are often unsolicited financial spam.',
  },
  {
    id: "R15",
    name: "Discount + Buy Now Rule",
    conditions: [
      (facts) => facts.contains.includes("discount"),
      (facts) => facts.contains.includes("buy"),
    ],
    conclusion: "SPAM",
    score: 3,
    explanation: '"Discount" + "buy" triggers typical commercial spam detection.',
  },

  // ── TRUSTED SENDER — NOT SPAM RULES ─────────────────────────
  {
    id: "R16",
    name: "Trusted Sender Rule",
    conditions: [(facts) => facts.trusted_sender === true],
    conclusion: "NOT_SPAM",
    score: -10,
    explanation: "Sender is in the trusted whitelist — email is classified as legitimate.",
  },
  {
    id: "R17",
    name: "Meeting + Schedule Rule (Legitimate)",
    conditions: [
      (facts) => facts.contains.includes("meeting"),
      (facts) => facts.contains.includes("schedule"),
      (facts) => !facts.contains.includes("free"),
      (facts) => !facts.contains.includes("win"),
    ],
    conclusion: "NOT_SPAM",
    score: -5,
    explanation: 'Email discusses a meeting/schedule without spam keywords — likely legitimate.',
  },
  {
    id: "R18",
    name: "Invoice + Attached Rule (Legitimate)",
    conditions: [
      (facts) => facts.contains.includes("invoice"),
      (facts) => facts.contains.includes("attached"),
      (facts) => !facts.contains.includes("free"),
    ],
    conclusion: "NOT_SPAM",
    score: -4,
    explanation: 'Invoice with attachment and no spam keywords — likely a legitimate business email.',
  },

  // ── PROMOTIONAL RULES ───────────────────────────────────────────
  {
    id: "R19",
    name: "Marketing Sender Rule",
    conditions: [(facts) => (facts.sender || "").includes("marketing")],
    conclusion: "PROMOTIONAL",
    score: 0,
    explanation: "Sender address contains 'marketing' → classified as PROMOTIONAL.",
  },
  {
    id: "R20",
    name: "Unsubscribe Rule",
    conditions: [(facts) => facts.contains.includes("unsubscribe")],
    conclusion: "PROMOTIONAL",
    score: 0,
    explanation: "Contains 'unsubscribe' → classified as PROMOTIONAL.",
  },
  {
    id: "R21",
    name: "Report + Download Rule",
    conditions: [
      (facts) => facts.contains.includes("report"),
      (facts) => facts.contains.includes("download"),
    ],
    conclusion: "PROMOTIONAL",
    score: 0,
    explanation: "Contains 'report' and 'download' → classified as PROMOTIONAL.",
  },
  {
    id: "R22",
    name: "Newsletter or Update Rule",
    conditions: [
      (facts) => facts.contains.includes("newsletter") || facts.contains.includes("update")
    ],
    conclusion: "PROMOTIONAL",
    score: 0,
    explanation: "Contains 'newsletter' or 'update' → classified as PROMOTIONAL.",
  },
  {
    id: "R23",
    name: "Long Email + Link Rule",
    conditions: [
      (facts) => facts.word_count > 150,
      (facts) => facts.link_count >= 1,
    ],
    conclusion: "PROMOTIONAL",
    score: 0,
    explanation: "Long email (>150 words) with at least 1 link → classified as PROMOTIONAL.",
  },
];

/**
 * List of trusted senders (whitelist).
 * Classical AI Concept: Closed-World Assumption — anything not
 * in the list is treated as unknown/untrusted.
 */
const trustedSenders = [
  "boss@company.com",
  "hr@company.com",
  "admin@university.edu",
  "noreply@github.com",
  "support@google.com",
  "no-reply@amazon.com",
  "billing@stripe.com",
];

/**
 * Heuristic keyword scores for the spam scoring system.
 * Classical AI Concept: Heuristic evaluation function.
 */
const heuristicScores = {
  win: 2,
  free: 2,
  money: 2,
  click: 1,
  offer: 2,
  prize: 3,
  winner: 3,
  congratulations: 2,
  won: 2,
  guaranteed: 2,
  income: 1,
  password: 3,
  verify: 2,
  bank: 2,
  account: 1,
  update: 1,
  limited: 1,
  claim: 2,
  reward: 2,
  investment: 1,
  profit: 1,
  discount: 1,
  buy: 1,
  urgent: 2,
  now: 1,
  casino: 3,
  lottery: 3,
  million: 2,
  billion: 2,
  credit: 1,
  loan: 1,
  debt: 1,
  refinance: 2,
  mortgage: 1,
  pills: 3,
  viagra: 3,
  pharmacy: 2,
  cheap: 1,
  deal: 1,
};

const SPAM_SCORE_THRESHOLD = 5;

module.exports = { rules, trustedSenders, heuristicScores, SPAM_SCORE_THRESHOLD };
