const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  // Serve chess.html as the default page
  let filePath = path.join(__dirname, req.url === '/' ? 'chess.html' : req.url);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200);
    res.end(content);
  });
});

const wss = new WebSocket.Server({ server });

let players = [];

wss.on('connection', (ws) => {
  if (players.length >= 2) {
    ws.send(JSON.stringify({ type: 'error', message: 'Game full' }));
    ws.close();
    return;
  }
  
  players.push(ws);
  ws.send(JSON.stringify({ type: 'info', message: 'Connected to chess server' }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'move') {
        // Broadcast move to the other player
        players.forEach(player => {
          if (player !== ws && player.readyState === WebSocket.OPEN) {
            player.send(JSON.stringify({ type: 'move', move: data.move }));
          }
        });
      }
    } catch (e) {
      // Ignore invalid messages
    }
  });

  ws.on('close', () => {
    players = players.filter(p => p !== ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
