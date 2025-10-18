// src/index.js
// Cloud Run–ready Express server serving /src/static/index.html

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// Simple request log
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve all static assets from /src/static (css/js/images, etc.)
const staticDir = path.join(__dirname, "static");
app.use(express.static(staticDir));

// Root -> serve your HTML
app.get("/", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

// (Optional) SPA fallback: uncomment if you need client-side routing
// app.get("*", (_req, res) => {
//   res.sendFile(path.join(staticDir, "index.html"));
// });

// Health endpoints for Cloud Run
app.get("/health", (_req, res) => res.status(200).send("ok"));
app.get("/ready", (_req, res) => res.status(200).send("ready"));

const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
});
