const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const app = express();

app.use(express.static(PUBLIC_DIR));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    game: 'FactionRush.io',
    rooms: 0,
    humans: 0,
    players: 0,
    uptime: process.uptime()
  });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', socket => {
  socket.send(JSON.stringify({ type: 'welcome', id: `player_${Date.now()}` }));
});

server.listen(PORT, () => {
  console.log(`FactionRush.io listening on http://localhost:${PORT}`);
});
