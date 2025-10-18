// index.js
// Minimal Express server for Cloud Run: serves index.html and exposes health checks.

const express = require("express");
const path = require("path");

const app = express();

// Cloud Run provides PORT; default to 8080 for local/dev.
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// Basic request logging (useful during troubleshooting)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve any static assets if you later add a /public folder
// e.g., /public/styles.css -> https://<service>/styles.css
app.use(express.static(path.join(__dirname, "public")));

// Root route -> send the provided index.html at repo root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Liveness & readiness probes (handy for Cloud Run)
app.get("/health", (req, res) => res.status(200).send("ok"));
app.get("/ready", (req, res) => res.status(200).send("ready"));

// Start the server
const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

// Graceful shutdown (Cloud Run sends SIGTERM on revision stop)
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  // Force-exit if not closed in time
  setTimeout(() => {
    console.error("Forcing shutdown.");
    process.exit(1);
  }, 10000);
});
