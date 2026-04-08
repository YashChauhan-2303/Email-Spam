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

// ── Global Error Handlers (Crucial for preventing 521 crashes) ─
process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION 🔥 - Process terminating");
  console.error(err.name, err.message);
  console.error(err.stack);
  // Exit the process so Render can gracefully restart it
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 UNHANDLED REJECTION 🔥 - Unhandled Promise rejection");
  console.error(err);
  // Important: Node 15+ exits on unhandled rejections anyway, log it first
  process.exit(1);
});

const app = express();
// Default to 5000, Render supplies PORT dynamically
const PORT = process.env.PORT || 5000;
// Render requires binding to 0.0.0.0 for external availability
const HOST = "0.0.0.0";

// ── Middleware ─────────────────────────────────────────────────

// 1. Request Timeout Middleware (prevents hanging requests)
app.use((req, res, next) => {
  req.setTimeout(15000, () => {
    console.warn(`⏳ Request Timeout on ${req.method} ${req.originalUrl}`);
    if (!res.headersSent) {
      res.status(408).json({ error: "Request Timeout - Server took too long to respond." });
    }
  });
  next();
});

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://emailspamcheck.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 2. Limit payload size to avoid memory bloat
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(morgan("dev"));

// ── Routes ─────────────────────────────────────────────────────
app.use("/api", spamRoutes);

// ── Root & Health Check ────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Rule-Based Intelligent Agent for Email Spam Classification",
    description: "Classical AI system using Forward Chaining Inference Engine",
    endpoints: {
      "POST /api/analyze": "Analyze email for spam",
      "GET  /api/rules":   "View knowledge base",
      "GET  /health":      "Detailed Health check",
    },
  });
});

app.get('/health', (req, res) => {
  // Enhanced health check for Render/UptimeRobot reliability monitoring
  try {
    const memoryUsage = process.memoryUsage();
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      }
    });
  } catch (err) {
    res.status(500).json({ status: "ERROR", error: err.message });
  }
});

// ── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 Express Pipeline Error:", err.stack || err.message);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: "CORS error: Domain not authorized" });
  }

  const isDev = process.env.NODE_ENV !== "production";
  res.status(500).json({ 
    error: "Internal Server Error",
    details: isDev ? err.message : undefined 
  });
});

// ── Start Server ───────────────────────────────────────────────
const server = app.listen(PORT, HOST, () => {
  console.log(`\n╔══════════════════════════════════════════════════════╗`);
  console.log(`║  🤖 Intelligent Email Spam Agent — Server Started    ║`);
  console.log(`║     Listening on: http://${HOST}:${PORT}                 ║`);
  console.log(`╚══════════════════════════════════════════════════════╝\n`);
});

// ── Graceful Shutdown (For Render Deploys) ─────────────────────
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Closed out remaining connections.");
    process.exit(0);
  });
});

module.exports = app;
