# Robot Room — 5-Player Walk-Around

A real multiplayer game needs a server that keeps all players in sync — that's
what `server.js` does here (Node + WebSockets). GitHub Codespaces is a great
free way to host it and hand out a link.

## Files

Everything lives flat in the repo root — no subfolders, so it's easy to
upload from mobile or drag-and-drop into a Codespace:

- `server.js` — Express + WebSocket server. Tracks up to 5 connected players,
  their chosen robot, and their position, and relays updates to everyone else.
  Serves every file in the same folder as static content.
- `index.html` — the whole client: robot select screen + Three.js 3D room +
  movement + chat. Single file, loads Three.js from a CDN.
- `package.json` — dependencies (`express`, `ws`).
- `.gitignore` — keeps `node_modules` out of the repo.

## Run it in Codespaces

1. Create a new repo (or use an existing one) and add `server.js`,
   `index.html`, `package.json`, and `.gitignore` to the repo root — e.g. via
   **Add file → Upload files** on github.com (works fine on mobile since
   there's no folder to navigate into).
2. On the repo page: **Code → Codespaces → Create codespace on main**.
3. Once the Codespace terminal opens, run:
   ```bash
   npm install
   npm start
   ```
4. Codespaces will detect port `3000` and pop up a notification — or open the
   **Ports** tab, find port 3000, and:
   - Right-click it → **Port Visibility → Public** (so your 4 friends, who
     don't have access to your Codespace, can open it too).
   - Click the globe icon / copy the forwarded URL.
5. Send that URL to up to 5 people (including yourself). Each person who
   opens it:
   - Picks a robot chassis (each chassis can only be used by one player at a
     time — taken ones gray out live for everyone).
   - Optionally sets a callsign.
   - Clicks **DEPLOY**, then clicks the 3D view once to lock the mouse.
6. Controls: **WASD**/arrows to walk, mouse to look around (third-person
   follow camera), **Enter** to open chat, **Esc** to release the mouse.

## Notes

- The server enforces a hard cap of 5 simultaneous connections — a 6th
  visitor gets a "room full" message.
- Player position updates are broadcast over WebSocket at ~16/sec and
  smoothed (lerped) on other clients, so movement looks fluid even on a
  so-so connection.
- Everything is in-memory — restarting the server clears all players (as
  expected for a small game like this).
- Want it live even when your Codespace/laptop is off? Deploy `server.js`
  the same way to any Node host (Render, Railway, Fly.io, a VPS, etc.) — the
  code doesn't depend on Codespaces specifically.

## Customizing

- Robot chassis types/colors/shapes are defined in two places that must stay
  in sync: `ROBOT_TYPES` in `server.js` and the `ROBOTS` object in
  `index.html`.
- Room size, walls, pillars, and crates are built procedurally near the top
  of the `<script>` in `index.html` — tweak `ROOM`, `wallH`, or the
  `pillarPositions` array to reshape the space.
