# FactionRush.io

FactionRush.io is a fast browser-based multiplayer faction-war game.

Players choose Ember, Tide, or Moss, capture beacons, collect Gold and Supply, fight rival factions, steal the Crown Relic, and deliver it to their faction base.

## Routes

- `/` — branded landing page
- `/game.html` — playable game page
- `/health` — JSON health check
- `/sitemap.xml` — search-engine sitemap
- `/robots.txt` — crawler instructions

The WebSocket endpoint uses the same host and port as the HTTP server. The client automatically selects `ws://` locally and `wss://` when deployed over HTTPS.

## Requirements

- Node.js 18 or newer
- npm
- A host that supports long-running Node.js processes and WebSockets

## Local development

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Open:

```text
http://localhost:3000/
```

The game is available at:

```text
http://localhost:3000/game.html
```

The server honors the hosting provider's `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Environment settings

Only one environment setting is required:

```text
PORT
```

Do not hard-code a public port. The server uses:

```js
Number(process.env.PORT) || 3000
```

No database, API key, or client-side secret is required.

## Deployment

Use a WebSocket-capable Node host such as Render, Railway, or Fly.io. Do not deploy this application as a static-only site or a serverless function because the multiplayer server maintains live WebSocket connections and an in-memory simulation.

### Render

1. Push the project to GitHub or GitLab.
2. In Render, create a new **Web Service**.
3. Connect the repository.
4. Set the runtime to Node.
5. Set the build command:

   ```text
   npm install
   ```

6. Set the start command:

   ```text
   npm start
   ```

7. Set the health check path:

   ```text
   /health
   ```

8. Choose a region and instance size.
9. Deploy the service.
10. Open the generated Render URL and verify both `/` and `/game.html`.

Render supplies the `PORT` environment variable automatically.

### Railway

1. Create a new Railway project.
2. Deploy from the GitHub repository.
3. Railway detects `package.json`.
4. Confirm the start command is:

   ```text
   npm start
   ```

5. Generate a public domain in the Railway service settings.
6. Configure the custom domain.
7. Verify:

   ```text
   https://your-generated-domain/health
   ```

Railway supplies the runtime port through `PORT`.

### Fly.io

1. Install and authenticate the Fly CLI.
2. Run:

   ```bash
   fly launch
   ```

3. Select the project directory.
4. Set the internal service port to the port exposed by `PORT`.
5. Deploy:

   ```bash
   fly deploy
   ```

6. Verify:

   ```text
   https://your-app.fly.dev/health
   ```

The Fly service must allow HTTP traffic and WebSocket upgrades on the public HTTPS service.

## DNS setup for FactionRush.io

Domain availability is unverified. Purchase the domain only after confirming that `FactionRush.io` is available through a registrar or authoritative RDAP lookup.

After deploying to a host:

### Root domain

At your DNS provider, add the record required by the host.

For a provider that supplies a hostname target, use an ALIAS or ANAME record if supported:

```text
Type: ALIAS or ANAME
Name: @
Target: your-host-provider-target.example
TTL: 300
```

If the provider specifically instructs you to use an A record, use the provider's published static IP:

```text
Type: A
Name: @
Value: PROVIDER_IP_ADDRESS
TTL: 300
```

Do not invent an IP address. Use the exact value shown by the hosting provider.

### WWW hostname

Add:

```text
Type: CNAME
Name: www
Target: factionrush.io
TTL: 300
```

Alternatively, point `www` to the canonical hostname supplied by the hosting provider.

### Host configuration

Add both domains to the host:

```text
factionrush.io
www.factionrush.io
```

Set `https://factionrush.io` as the canonical public URL. Enable automatic TLS certificates. The HTTPS connection is necessary for the browser to permit the `wss://` WebSocket connection.

## Verification checklist

Check the following after deployment:

```bash
curl https://factionrush.io/health
```

Expected response shape:

```json
{
  "ok": true,
  "game": "FactionRush.io",
  "rooms": 0,
  "humans": 0,
  "players": 0,
  "uptime": 12.34
}
```

Also verify:

- `https://factionrush.io/` loads the landing page.
- The Play button opens `https://factionrush.io/game.html`.
- `https://factionrush.io/game.html` loads the game client.
- The browser console has no WebSocket errors.
- Two separate browser windows can join the same live room.
- `https://factionrush.io/favicon.svg` loads.
- `https://factionrush.io/og-image.svg` loads.
- `https://factionrush.io/sitemap.xml` returns valid XML.
- The sitemap uses `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`.
- The canonical and Open Graph URLs use `https://factionrush.io`.
- HTTPS is active before testing multiplayer.
- The host is not configured to sleep or terminate the Node process during active sessions.

## Runtime note

Room state is held in process memory. Restarting or redeploying the service resets active rooms and matches. For the current game design, this is intentional and no persistent database is required.

## One-click Render deployment

Use the repository's Render Blueprint to launch the free web service:

[Deploy to Render](https://render.com/deploy?repo=https://github.com/caytec/factionrush-io)

Render requires you to sign in and click **Apply**. The free service may sleep when idle.
