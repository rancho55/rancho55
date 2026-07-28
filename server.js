const express = require('express');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(__dirname));

const MAX_PLAYERS = 5;
const ROBOT_TYPES = ['sentinel', 'vanguard', 'specter', 'juggernaut', 'wraith'];

// id -> player state
const players = {};
let nextId = 1;
let activeConnections = 0;

function broadcast(msg, exceptWs) {
  const data = JSON.stringify(msg);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== exceptWs) {
      client.send(data);
    }
  });
}

wss.on('connection', (ws) => {
  if (activeConnections >= MAX_PLAYERS) {
    ws.send(JSON.stringify({ type: 'full' }));
    ws.close();
    return;
  }
  activeConnections++;

  const id = nextId++;
  players[id] = {
    id,
    name: `UNIT-${String(id).padStart(2, '0')}`,
    robotType: null,
    x: 0, y: 0, z: 0, ry: 0,
  };
  ws.playerId = id;

  ws.send(JSON.stringify({
    type: 'welcome',
    id,
    players: Object.values(players),
    takenRobots: Object.values(players).filter((p) => p.robotType).map((p) => p.robotType),
    robotTypes: ROBOT_TYPES,
    maxPlayers: MAX_PLAYERS,
  }));

  broadcast({ type: 'playerJoined', player: players[id] }, ws);

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch (e) { return; }
    const p = players[ws.playerId];
    if (!p) return;

    if (msg.type === 'select') {
      const takenByOther = Object.values(players).some(
        (pl) => pl.robotType === msg.robotType && pl.id !== p.id
      );
      if (takenByOther || !ROBOT_TYPES.includes(msg.robotType)) {
        ws.send(JSON.stringify({ type: 'selectRejected', robotType: msg.robotType }));
        return;
      }
      p.robotType = msg.robotType;
      if (typeof msg.name === 'string' && msg.name.trim()) {
        p.name = msg.name.trim().slice(0, 16);
      }
      ws.send(JSON.stringify({ type: 'selectConfirmed', robotType: p.robotType, name: p.name }));
      broadcast({ type: 'playerSelected', id: p.id, robotType: p.robotType, name: p.name });
    }

    if (msg.type === 'move' && p.robotType) {
      p.x = msg.x; p.y = msg.y; p.z = msg.z; p.ry = msg.ry;
      broadcast({ type: 'playerMoved', id: p.id, x: p.x, y: p.y, z: p.z, ry: p.ry }, ws);
    }

    if (msg.type === 'chat' && typeof msg.text === 'string') {
      const text = msg.text.slice(0, 140);
      broadcast({ type: 'chat', id: p.id, name: p.name, text });
    }
  });

  ws.on('close', () => {
    activeConnections = Math.max(0, activeConnections - 1);
    delete players[ws.playerId];
    broadcast({ type: 'playerLeft', id: ws.playerId });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Robot Room server running on port ${PORT}`);
});
