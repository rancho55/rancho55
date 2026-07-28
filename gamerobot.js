const socket = io();

const gameRoom = document.getElementById("gameRoom");
const squadList = document.getElementById("squadList");
const statusText = document.getElementById("status");

let myPlayer = null;

const keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

socket.on("connect", () => {
  statusText.textContent = "ONLINE";
});

socket.on("disconnect", () => {
  statusText.textContent = "DISCONNECTED";
});

socket.on("welcome", (data) => {
  myPlayer = data.player;

  statusText.textContent =
    `CONNECTED AS ${myPlayer.name} — ${myPlayer.role}`;
});

socket.on("playersUpdated", (players) => {

  gameRoom.innerHTML = "";

  squadList.innerHTML = "";

  players.forEach(player => {

    // Create robot on map.

    const robot = document.createElement("div");

    robot.className = "robot";

    robot.style.left = `${player.x}px`;
    robot.style.top = `${player.y}px`;
    robot.style.color = player.color;

    robot.innerHTML = `
      <div class="robotHead"></div>
      <div class="robotBody"></div>
      <div class="robotName">${player.name}</div>
      <div class="robotRole">${player.role}</div>
    `;

    gameRoom.appendChild(robot);

    // Create squad information card.

    const member = document.createElement("div");

    member.className = "squadMember";

    member.style.borderColor = player.color;

    member.innerHTML = `
      <strong>${player.name}</strong>
      <br>
      ${player.role}
    `;

    squadList.appendChild(member);

  });

});

function sendMovement() {

  if (!myPlayer) return;

  if (
    keys.up ||
    keys.down ||
    keys.left ||
    keys.right
  ) {

    socket.emit("move", keys);

  }

}

// Keyboard controls.

window.addEventListener("keydown", (event) => {

  switch (event.key.toLowerCase()) {

    case "w":
    case "arrowup":
      keys.up = true;
      break;

    case "s":
    case "arrowdown":
      keys.down = true;
      break;

    case "a":
    case "arrowleft":
      keys.left = true;
      break;

    case "d":
    case "arrowright":
      keys.right = true;
      break;

  }

});

window.addEventListener("keyup", (event) => {

  switch (event.key.toLowerCase()) {

    case "w":
    case "arrowup":
      keys.up = false;
      break;

    case "s":
    case "arrowdown":
      keys.down = false;
      break;

    case "a":
    case "arrowleft":
      keys.left = false;
      break;

    case "d":
    case "arrowright":
      keys.right = false;
      break;

  }

});

// Touch controls.

document
  .querySelectorAll("#controls button")
  .forEach(button => {

    const direction = button.dataset.key;

    button.addEventListener("pointerdown", (event) => {

      event.preventDefault();

      keys[direction] = true;

    });

    button.addEventListener("pointerup", () => {

      keys[direction] = false;

    });

    button.addEventListener("pointercancel", () => {

      keys[direction] = false;

    });

    button.addEventListener("pointerleave", () => {

      keys[direction] = false;

    });

  });

// Send movement 20 times per second.

setInterval(sendMovement, 50);