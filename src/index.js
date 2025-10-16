// index.js
const express = require('express');
const app = express();

// Cloud Run provides the port via environment variable
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
  res.send('✅ Hello from Cloud Run! Your container is running successfully.');
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
