const express = require('express');
const app = express();
// Remove DB dependencies if you don't want DB
// const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

// Routes
app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

// Health endpoints (optional, useful for Cloud Run)
app.get('/healthz', (req, res) => res.status(200).send('OK'));
app.get('/readyz', (req, res) => res.status(200).send('READY'));

// Use Cloud Run PORT environment variable
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('⚠️ Shutting down gracefully...');
  process.exit(0);
};

['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach(sig => {
  process.on(sig, gracefulShutdown);
});
