const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files directly from the root folder
app.use(express.static(__dirname));

// Route root URL directly to index-robot.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index-robot.html"));
});

const robots = [
  {
    id: "robot-alpha",
    name: "Troy",
    role: "Commander",
    color: "#4cc9ff"
  },
  {
    id: "robot-bravo",
    name: "Vex",
    role: "Scout",
    color: "#72ff9a"
  },
  {
    id: "robot-charlie",
    name: "Quaron",
    role: "Heavy",
    color: "#ffb347"
  },
  {
    id: "robot-delta",
    name: "Nyx",
    role: "Engineer",
    color: "#d18cff"
  }
];

const players = {};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  const slot = Object.keys(players).length % 4;
  const robot = robots[slot];

  players[socket.id] = {
    socketId: socket.id,
    robotId: robot.id,
    name: robot.name,
    role: robot.role,
    color: robot.color,
    x: 200 + slot * 100,
    y: 250
  };

  socket.emit("welcome", {
    player: players[socket.id],
    robots
  });

  io.emit("playersUpdated", Object.values(players));

  socket.on("move", (movement) => {
    const player = players[socket.id];

    if (!player) return;

    const speed = 5;

    if (movement.left) {
      player.x -= speed;
    }

    if (movement.right) {
      player.x += speed;
    }

    if (movement.up) {
      player.y -= speed;
    }

    if (movement.down) {
      player.y += speed;
    }

    // Keep robots inside the room.
    player.x = clamp(player.x, 40, 760);
    player.y = clamp(player.y, 100, 520);

    io.emit("playersUpdated", Object.values(players));
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    delete players[socket.id];

    io.emit("playersUpdated", Object.values(players));
  });
});

server.listen(PORT, () => {
  console.log(`Robot Team server running on port ${PORT}`);
});