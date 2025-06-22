const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
};

const server = http.createServer((req, res) => {
  // Serve chess.html as the default page
  let filePath = path.join(__dirname, req.url === '/' ? 'chess.html' : req.url);

  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error serving file ${filePath}: ${err.message}`); // Added logging
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

const wss = new WebSocket.Server({ server });

let players = [];

wss.on('connection', (ws) => {
  if (players.length >= 2) {
    ws.send(JSON.stringify({ type: 'error', message: 'Game full' }));
    ws.close();
    console.log(`[${new Date().toLocaleTimeString()}] Client rejected: Game full. Current players: ${players.length}`); // Added logging
    return;
  }

  players.push(ws);
  console.log(`[${new Date().toLocaleTimeString()}] Client connected. Total players: ${players.length}`); // Added logging
  ws.send(JSON.stringify({ type: 'info', message: 'Connected to chess server' }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'move') {
        console.log(`[${new Date().toLocaleTimeString()}] Received move: ${data.move} from a player.`); // Added logging
        // Broadcast move to the other player
        let broadcastCount = 0;
        players.forEach(player => {
          if (player !== ws && player.readyState === WebSocket.OPEN) {
            player.send(JSON.stringify({ type: 'move', move: data.move }));
            broadcastCount++;
          }
        });
        console.log(`[${new Date().toLocaleTimeString()}] Broadcasted move to ${broadcastCount} other player(s).`); // Added logging
      } else {
        console.log(`[${new Date().toLocaleTimeString()}] Received unknown message type: ${data.type}`); // Added logging
      }
    } catch (e) {
      console.error(`[${new Date().toLocaleTimeString()}] Error parsing message or broadcasting: ${e.message}`); // Added logging
      // Ignore invalid messages
    }
  });

  ws.on('close', () => {
    players = players.filter(p => p !== ws);
    console.log(`[${new Date().toLocaleTimeString()}] Client disconnected. Total players remaining: ${players.length}`); // Added logging
  });

  ws.on('error', (error) => {
    console.error(`[${new Date().toLocaleTimeString()}] WebSocket error for a client: ${error.message}`); // Added logging
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[${new Date().toLocaleTimeString()}] Server running on port ${PORT}`); // Added logging
});