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
      console.error(`Error serving file ${filePath}: ${err.message}`);
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

// Set HTTP server timeout to 5 minutes (300,000 milliseconds)
server.timeout = 5 * 60 * 1000;
console.log(`[${new Date().toLocaleTimeString()}] HTTP server timeout set to ${server.timeout / 1000} seconds.`);

// Optional: Handle the 'timeout' event for the HTTP server
server.on('timeout', (socket) => {
    console.log(`[${new Date().toLocaleTimeString()}] HTTP server socket timed out. Destroying connection.`);
    socket.destroy(); // Manually destroy the socket if it times out
});


const wss = new WebSocket.Server({ server });

let players = [];
const MAX_PLAYERS = 5; // Set maximum players to 5

wss.on('connection', (ws) => {
  if (players.length >= MAX_PLAYERS) {
    ws.send(JSON.stringify({ type: 'error', message: 'Game full' }));
    ws.close();
    console.log(`[${new Date().toLocaleTimeString()}] Client rejected: Game full. Current players: ${players.length}`);
    return;
  }

  players.push(ws);
  console.log(`[${new Date().toLocaleTimeString()}] Client connected. Total players: ${players.length}`);
  ws.send(JSON.stringify({ type: 'info', message: 'Connected to chess server' }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'move') {
        console.log(`[${new Date().toLocaleTimeString()}] Received move: ${data.move} from a player.`);
        // Broadcast move to all other players
        let broadcastCount = 0;
        players.forEach(player => {
          if (player !== ws && player.readyState === WebSocket.OPEN) {
            player.send(JSON.stringify({ type: 'move', move: data.move }));
            broadcastCount++;
          }
        });
        console.log(`[${new Date().toLocaleTimeString()}] Broadcasted move to ${broadcastCount} other player(s).`);
      } else {
        console.log(`[${new Date().toLocaleTimeString()}] Received unknown message type: ${data.type}`);
      }
    } catch (e) {
      console.error(`[${new Date().toLocaleTimeString()}] Error parsing message or broadcasting: ${e.message}`);
      // Ignore invalid messages
    }
  });

  ws.on('close', () => {
    players = players.filter(p => p !== ws);
    console.log(`[${new Date().toLocaleTimeString()}] Client disconnected. Total players remaining: ${players.length}`);
  });

  ws.on('error', (error) => {
    console.error(`[${new Date().toLocaleTimeString()}] WebSocket error for a client: ${error.message}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[${new Date().toLocaleTimeString()}] Server running on port ${PORT}`);
});