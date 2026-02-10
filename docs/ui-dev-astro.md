UI Dev Flow (Astro + mobile)

Goal
- Run the Astro dev server on the VPS and view it live on your phone over Tailscale.

Prereqs
- Tailscale connected on both VPS and phone
- Node.js installed on the VPS (check `.nvmrc` for the repo’s preferred version)

Node version
- If the repo has `.nvmrc`, match that version on the VPS (e.g., Node 22).
- You can install via NodeSource or nvm; keep the VPS version aligned with the repo.

Run the dev server
1) SSH to the VPS and enter the repo:

```bash
cd ~/development/your-repo
```

2) Install deps:

```bash
npm install
```

3) Start the dev server, listening on all interfaces:

```bash
npm run dev -- --host
```

Astro’s dev server defaults to port 4321. You can change it:

```bash
npm run dev -- --host --port 4321
```

Phone access (Tailscale)
- Use the VPS tailnet IP, e.g.:

```text
http://TAILNET_IP:4321
```

Notes
- `--host` exposes the dev server on the network interface, which is required to reach it from a phone. This is safe over Tailscale.
- Do not expose the dev server publicly in production.
- If you use a custom hostname (e.g. local dev domain), you may need to allow it via Astro’s `server.allowedHosts`.

HMR troubleshooting (Vite)
If the page loads but hot reload doesn’t work, set explicit HMR host/port in `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    server: {
      hmr: {
        host: "TAILNET_IP",
        clientPort: 4321,
      },
    },
  },
});
```

References
- Astro CLI `--host` and `--port` (mobile testing)
- Astro server config (`server.host`, `server.allowedHosts`)
- Vite HMR config (`server.hmr`)
