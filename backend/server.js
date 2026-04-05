/**
 * ============================================================
 * SERVER ENTRY POINT
 * Rule-Based Intelligent Agent for Email Spam Classification
 * ============================================================
 * Backend: Node.js + Express
 * Algorithm: Forward Chaining (Classical AI)
 * ============================================================
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const spamRoutes = require("./routes/spamRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (dev style)
app.use(morgan("dev"));

// ── Routes ─────────────────────────────────────────────────────
app.use("/api", spamRoutes);

// ── Root ───────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Rule-Based Intelligent Agent for Email Spam Classification",
    description: "Classical AI system using Forward Chaining Inference Engine",
    endpoints: {
      "POST /api/analyze": "Analyze email for spam",
      "GET  /api/rules":   "View knowledge base",
      "GET  /api/health":  "Health check",
    },
  });
});

// ── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err);
  res.status(500).json({ error: "An unexpected error occurred." });
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  // console.log(`\n╔══════════════════════════════════════════════════════╗`);
  // console.log(`║  🤖 Intelligent Email Spam Agent — Server Started    ║`);
  // console.log(`║     http://localhost:${PORT}                            ║`);
  // console.log(`║     Algorithm: Forward Chaining (Classical AI)        ║`);
  // console.log(`╚══════════════════════════════════════════════════════╝\n`);
});

module.exports = app;
