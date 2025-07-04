// src/services/websocketService.js

let ioInstance = null;

/**
 * Initialize WebSocket Server
 * @param {http.Server} server - The HTTP server instance
 */
exports.initWebSocket = (server) => {
  const { Server } = require('socket.io');

  const io = new Server(server, {
    cors: {
      origin: '*', // You can restrict this to your frontend domain
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[✓] WebSocket client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[✕] Client disconnected: ${socket.id}`);
    });
  });

  ioInstance = io;
};

/**
 * Broadcasts real-time bike data to all connected clients
 * @param {Object} bikeData - The bike data to emit
 */
exports.broadcastBikeData = (bikeData) => {
  if (!ioInstance) {
    console.warn('[!] Cannot broadcast: WebSocket not initialized');
    return;
  }

  ioInstance.emit('bikeData', bikeData);
};
