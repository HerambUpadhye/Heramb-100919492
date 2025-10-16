const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

// --- START: CLOUD RUN FIX ---
// 1. Read the port from the environment variable 'PORT'
// 2. Default to 8080 for local development (as 8080 is the default port Cloud Run expects)
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0'; // Bind to all network interfaces
// --- END: CLOUD RUN FIX ---

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

db.init().then(() => {
    // 3. Use the dynamic PORT and explicitly bind to the HOST (0.0.0.0)
    app.listen(PORT, HOST, () => {
        console.log(`Server listening successfully on ${HOST}:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to initialize database or start server:", err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {
            console.warn('Database teardown failed during shutdown.');
        })
        .then(() => {
            console.log('Graceful shutdown complete.');
            process.exit();
        });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon

