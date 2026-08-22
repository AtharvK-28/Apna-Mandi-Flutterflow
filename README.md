# Apna Mandi

A marketplace for India's street food economy. Frontend-only React SPA — all data
and authentication are mocked client-side; there is no backend in this repo.

Three user types are treated as three separate apps sharing one shell:

| Role | What they do | Lands on |
|---|---|---|
| **Vendor** | Runs a food stall — buys stock, hires help, trades surplus | `/home` |
| **Karigar** | Skilled worker who sells labour by the shift | `/karigar/find-work` |
| **Supplier** | Wholesaler who fulfils vendor orders | `/supplier` |

## Getting started

```bash
npm install
npm start          # dev server on http://localhost:4028
```

### Demo accounts

There is no real OTP service. Use these pairs, or press **Autofill** on the OTP
screen:

| Role | Phone | OTP |
|---|---|---|
| Vendor | 9876543210 | 123456 |
| Karigar | 9876543212 | 111111 |
| Supplier | 9876543211 | 654321 |

"Continue as guest" gives account-less, read-only browsing of `/home`, `/deals`
and `/khau-galli`.

## Commands

| Command | What it does |
|---|---|
| `npm start` | Dev server (port 4028) |
| `npm run build` | Production build to `dist/`, with sourcemaps |
| `npm run serve` | Preview the production build |
| `npm test` | Unit tests (Vitest) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:coverage` | Unit tests with coverage |
| `npm run test:e2e` | Browser tests — starts and stops the dev server itself |
| `npm run test:offline` | Offline/PWA tests — builds, previews and cuts the network |
| `npm run icons` | Regenerates the PNG icons from `public/icon.svg` |

### Tests

**Unit** (`src/**/*.test.{js,jsx}`) cover the rules that are easy to break by
accident: the role/capability model, the route guards, session persistence and
its migration from the older storage keys, the Vyapaar score arithmetic, and the
earnings maths.

**End to end** (`tests/e2e/`) drives a real browser through a full login for each
of the three roles, then tries to walk into the other roles' routes by URL. This
is the check that matters most — before route guards existed, every page in the
app was reachable by anyone, signed in or not.

**Offline** (`npm run test:offline`) runs against the *production build*, since
that is the only place the service worker registers. It checks the manifest and
icons, waits for the worker to take control, then cuts the connection and
reloads — the app has to still be there.

All three suites use `playwright-core` with a browser you already have installed
(Chrome or Edge, found automatically). Override with `CHROME_PATH=/path/to/chrome`,
watch one run with `HEADED=1`, or point at a running instance with `BASE_URL=...`.

## Architecture

[CLAUDE.md](CLAUDE.md) is the detailed guide. The short version:

- **[src/config/roles.js](src/config/roles.js)** is the single source of truth for
  roles, landing routes, navigation and capabilities. Adding a page means adding
  it here as well as to the router.
- **Every route is gated** by `<Protected allow={[...]}>` in
  [src/Routes.jsx](src/Routes.jsx). Signed-out visitors go to `/login`; a
  signed-in user who reaches another role's route is sent to their own home.
- **[src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx)** is the only
  place that touches session storage. Components read `useAuth()`.
- **Mock data lives in `src/data/`**, not in components, so swapping in a real
  API means replacing those modules rather than editing JSX.
- **Styling** uses CSS-variable design tokens. Use the brand names
  (`terracotta`, `paper`, `ink`…) or the semantic ones (`primary`, `card`…) —
  never Tailwind's default palette, which does not respond to dark mode.
- **No emoji in the UI.** Use `<Icon name="…" />` in a brand-tinted tile.
- **Voice** is built on the Web Speech API — read-aloud buttons and
  dictate-by-mic, in English, Hindi and Marathi. Both hide themselves where the
  browser can't support them (dictation needs Chrome, Edge or Safari). Toggle
  and language live under Profile → Settings.

## Offline and install

The people this is built for open it standing in a market on a phone with one bar
of signal. So it is a real installable app, not just a website:

- **It survives losing the network.** [public/sw.js](public/sw.js) caches the app
  shell, the fingerprinted build output and images. Reloading with no connection
  gives you the app, not the browser's error page. Verified by
  `npm run test:offline`, which actually cuts the connection and reloads.
- **It says so plainly.** [ConnectionStatus](src/components/ui/ConnectionStatus.jsx)
  shows "No connection — pages you have opened still work. Sending needs signal."
  Nothing pretends an action succeeded while offline.
- **It installs to the home screen.** Profile → Settings offers it where the
  browser supports it, and shows Safari's manual steps on iOS, where there is no
  programmatic install.
- **Updates are offered, not forced.** A new service worker waits rather than
  replacing the code under a running page; the same status bar offers a refresh.

The worker is only registered in a production build — caching Vite's dev modules
breaks hot reload in ways that look like your edits are being ignored.

Icons come from [public/icon.svg](public/icon.svg); `npm run icons` re-renders the
PNGs from it through your installed Chrome, so the raster files never drift from
the vector source.

## Deployment

SPA rewrites are configured for Netlify ([netlify.toml](netlify.toml)) and Vercel
([vercel.json](vercel.json)), along with the cache headers the service worker
needs: `/assets/*` immutable for a year, `/sw.js` and `/index.html` revalidated
every time. Cache the worker and a deploy can sit unseen behind it.

`dist/` is committed, so production builds show up as tracked changes.

## Known gaps

- `redux` and `@reduxjs/toolkit` are declared but imported nowhere. They are kept
  only because `package.json`'s `rocketCritical` block lists them; drop them if
  you no longer use the Rocket/DhiWise tooling.
- The Rocket preview tracker was removed from `index.html` — it beaconed to a
  third-party host on every page view. See the comment there to restore it.
- Vendor Exchange, Virasaat, Khau Galli and Deal Discovery work and are themed
  correctly, but have not been moved onto `PageShell` yet.
- Offline covers *reading*. There is no backend in this repo, so nothing queues
  writes for replay — an order composed offline is not sent later. The UI is
  explicit about that rather than implying otherwise.
- `og:image` in [index.html](index.html) is a relative URL because the deploy
  domain isn't fixed. Make it absolute at launch; a few unfurlers need that.
