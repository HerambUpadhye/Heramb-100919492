const express = require('express');
const app = express();
const db = require('./persistence');
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

// Health & readiness probes (important for Cloud Run / GKE)
app.get('/healthz', (req, res) => res.status(200).send('OK'));
app.get('/readyz', async (req, res) => {
    try {
        await db.healthCheck();
        res.status(200).send('READY');
    } catch (err) {
        res.status(500).send('NOT READY');
    }
});

const PORT = process.env.PORT || 3000;

db.init()
    .then(() => {
        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('❌ Failed to initialize DB:', err);
        process.exit(1);
    });

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);
    try {
        await db.teardown();
        console.log('🧹 Database connection closed.');
    } catch (err) {
        console.error('Error during shutdown:', err);
    } finally {
        console.log('🛑 Exiting process.');
        process.exit(0);
    }
};

['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach((sig) => {
    process.on(sig, () => gracefulShutdown(sig));
});

