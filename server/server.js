const express = require('express');
const http = require('http');
const cors = require('cors');
const bikeRoutes = require('./src/routes/bikeRoutes');
const { initWebSocket } = require('./src/services/websocketService'); // Correct import

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use('/api', bikeRoutes);

// Initialize WebSocket server with the HTTP server
initWebSocket(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`);
});
