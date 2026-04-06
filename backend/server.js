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

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://email-spam-virid.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    
    // Check if the exact origin is allowed (no wildcards)
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies/authorization headers if needed
  optionsSuccessStatus: 200 // Resolve preflight correctly on older browsers
};

// Must be placed BEFORE routes so options/preflight requests are intercepted early
app.use(cors(corsOptions));

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
