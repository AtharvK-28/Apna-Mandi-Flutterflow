CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Apna Mandi is a marketplace platform for India's street food economy. It serves three distinct user types, and they are treated as three separate apps sharing one shell:

- **Vendor** — runs a food stall. Buys stock, hires help, sells food, trades surplus.
- **Karigar** — a skilled worker who sells labour by the shift.
- **Supplier** — a wholesaler who fulfils vendor orders.

It is a frontend-only React SPA — there is no backend in this repo. Login, OTP verification, and all data are mocked client-side (see "Mock data & demo auth").

## Commands

- `npm start` — start the Vite dev server (port 4028)
- `npm run build` — production build (outputs to `dist/`, with sourcemaps)
- `npm run serve` — preview the production build locally
- `npm test` — unit tests (Vitest + jsdom); `test:watch` and `test:coverage` also exist
- `npm run test:e2e` — browser tests; starts and stops the dev server itself
- `npm run test:offline` — offline/PWA tests; builds, previews, then cuts the network
- `npm run icons` — re-renders `public/icon-*.png` from `public/icon.svg`

Unit tests live beside their subject as `*.test.{js,jsx}`; the browser suites are in `tests/e2e/` — `roles.e2e.mjs` runs against the dev server, `offline.e2e.mjs` against a production preview. There is still no lint script.

## Architecture

### Roles and access control

**[src/config/roles.js](src/config/roles.js) is the single source of truth** for who each user type is, where they land after login, what navigation they see, and what they can do. Adding a page means adding it here as well as to the router — never hardcode a role check or a nav list in a component.

- `ROLE_META` — label, icon, landing route, tagline per role
- `NAV_BY_ROLE` — the header's primary nav, per role (guests included)
- `CAPABILITIES` / `can(role, capability)` — capability checks (`'cart'`, `'hire'`, `'work'`, …). Prefer `can('cart')` at call sites over comparing roles directly.

**Every route is gated.** [src/Routes.jsx](src/Routes.jsx) wraps each route in `<Protected allow={[...]}>` from [src/components/RouteGuard.jsx](src/components/RouteGuard.jsx):

- Signed-out visitor → redirected to `/login`, remembering where they were going
- Signed-in user on another role's route → redirected to their own home (not an error page)
- `allowGuest` opts a route into account-less browsing (`/home`, `/deals`, `/khau-galli`)
- `/` renders `<HomeRedirect>`, which sends each visitor to their own front door

**One canonical URL per page.** Legacy paths (`/vendor-dashboard`, `/deal-discovery-shopping`, `/shopping-cart-checkout`, `/order-tracking-history`, `/supplier-dashboard`) are `<Navigate replace>` redirects only. Do not reintroduce a second route that renders the same component.

Route layout by role:

| Role | Routes |
|---|---|
| Vendor | `/home`, `/deals`, `/cart`, `/orders`, `/dashboard`, `/karigar-connect`, `/vendor-exchange`, `/virasaat`, `/khau-galli` |
| Karigar | `/karigar/find-work`, `/karigar/my-work`, `/karigar/earnings`, `/karigar/messages` |
| Supplier | `/supplier`, `/supplier/orders`, `/supplier/inventory`, `/supplier/deliveries` |
| Shared | `/profile`, `/login` |

The supplier routes all render `src/pages/supplier/index.jsx` with a different `view` prop.

### Page structure

Each route lives under `src/pages/<page-name>/`, with `index.jsx` as the page entry and a `components/` subfolder for page-local components. Shared cross-page UI lives in `src/components/ui/`; work-related components shared between the vendor and karigar sides of the marketplace live in `src/components/work/`.

Use [src/components/ui/PageShell.jsx](src/components/ui/PageShell.jsx) for new pages — it supplies the document title, the role-aware `Header`, and a consistent content column. Pages that re-implement this drift apart on width, padding and heading size.

### Data layer

Mock data lives in `src/data/`, not inside components: `gigs.js`, `karigars.js`, `supplier.js`, `vyapaar.js`. Swapping in a real API should mean replacing these modules and the contexts that read them, not editing JSX.

### Global providers ([src/App.jsx](src/App.jsx))

`HelmetProvider` → `ThemeProvider` → `VoiceProvider` → `ToastProvider` → `AuthProvider` → `WorkProvider` → `CartProvider` → `Routes`.

- [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx) — **the only place that touches session storage.** Components read `useAuth()` (`role`, `user`, `displayName`, `isAuthenticated`, `isGuest`, `can()`, `signIn`, `signOut`, `continueAsGuest`). Persists to `apna-mandi-user` / `apna-mandi-session`, migrating the older `userData` / `userType` keys on first read. There is no placeholder identity — an unnamed user has `displayName === null` and callers decide how to greet them.
- [src/contexts/WorkContext.jsx](src/contexts/WorkContext.jsx) — gigs, applications, messages and earnings shared between the vendor's hiring view (`/karigar-connect`) and the karigar's job views (`/karigar/*`).
- [src/contexts/ToastContext.jsx](src/contexts/ToastContext.jsx) — `useToast().success/error/info`. **Never use `alert()`** — it blocks the page, cannot be themed, and reads poorly to screen readers.
- [src/contexts/CartContext.jsx](src/contexts/CartContext.jsx) — cart state keyed by item id, persisted to `apna-mandi-cart`, validated on load and save.
- [src/contexts/ThemeContext.jsx](src/contexts/ThemeContext.jsx) — dark/light mode, persisted to `theme`, toggled via a `dark` class on `<html>`.
- [src/contexts/VoiceContext.jsx](src/contexts/VoiceContext.jsx) — speech language, the voice on/off switch, and read-aloud. See "Voice" below.

`FloatingCartButton` renders inside the router (so it can read the route and navigate without a reload) and hides itself for anyone without the `cart` capability.

### Styling

Tailwind with CSS-variable design tokens in [src/styles/index.css](src/styles/index.css), mapped in [tailwind.config.js](tailwind.config.js). The brand names (`terracotta`, `turmeric`, `leaf`, `chili`, `paper`, `ink`) and the semantic names (`primary`, `card`, `background`, `muted`) are **the same variables** — `--card` is `--paper-light`, `--primary` is `--terracotta`. Both flip correctly in dark mode.

**Use brand or semantic tokens only.** Never use Tailwind's default palette (`bg-blue-500`, `text-green-600`, `bg-purple-50`…): those are fixed hex values that do not respond to the theme, so they appear as bright patches on a dark background.

**No emoji in the UI.** Use `<Icon name="…" />` in a brand-tinted tile — the pattern used across the app. Emoji render differently on every platform, cannot be recoloured, and are announced unpredictably by screen readers.

Fonts: `Baloo 2` (display/headings) and `Mukta` (body). Do not inject page-scoped `@import`s for other typefaces.

### UI primitives ([src/components/ui/](src/components/ui/))

Built with `class-variance-authority` for variants, Radix `Slot` for `asChild`, and `cn()` ([src/utils/cn.js](src/utils/cn.js)) for className merging. `Button.jsx` is the reference pattern.

- `Modal.jsx` — accessible dialog with focus trap, Escape-to-close, scroll lock and focus restore. Use it rather than hand-rolling an overlay.
- `Select.jsx` — custom listbox with keyboard navigation, `role="option"`, and outside-click/Escape dismissal. When `multiple`, pass an **array** as `value` (`formData.x || []`, never `|| ''`) and validate with `.length` — an empty array is truthy.
- `EmptyState.jsx` — for any list that can be empty; always name what would appear and offer the action that creates it.
- `useDismissable` ([src/hooks/useDismissable.js](src/hooks/useDismissable.js)) — outside-click + Escape for popovers.

**Icons**: [src/components/AppIcon.jsx](src/components/AppIcon.jsx) resolves any `lucide-react` icon by name, falling back to `HelpCircle` — verify names exist, since typos fail silently into the fallback.

**Images**: [src/components/AppImage.jsx](src/components/AppImage.jsx) wraps `<img>` with an `onError` fallback.

**Error handling**: [src/components/ErrorBoundary.jsx](src/components/ErrorBoundary.jsx) wraps the route tree; its recovery button goes to `/`, which routes each role to its own home.

### Voice (TTS and STT)

Built on the browser's Web Speech API — no keys, no backend, nothing to bill.
[src/contexts/VoiceContext.jsx](src/contexts/VoiceContext.jsx) owns the language
preference, the on/off switch and read-aloud;
[src/hooks/useSpeechRecognition.js](src/hooks/useSpeechRecognition.js) handles
dictation per field.

- `<SpeakButton text={...} id={...} />` reads a block aloud. `id` must be unique
  per page so only the button actually speaking shows as active.
- `<VoiceInput onTranscript={...} />` dictates into a field.
- Both **render nothing** where unsupported. Dictation is Chrome/Edge/Safari
  only, needs a secure context, and is absent in Firefox — a mic button that
  cannot work is worse than no mic button.
- Never pass raw UI strings to `speak()`. Use the formatters in
  [src/utils/speech.js](src/utils/speech.js): "₹750" is announced as a symbol
  name or skipped, and "5:00 PM - 10:00 PM" becomes "five colon zero zero".
- Spoken commands are matched by [src/utils/voiceCommands.js](src/utils/voiceCommands.js).
  It is keyword matching, not language understanding, and says so. Keywords are
  split into `strong` (decide outright) and `weak` (only if nothing is strong) —
  "chahiye" means "is needed" and appears in both an order and a hiring request,
  so without that split "helper chahiye" silently started a supply order.
- Users code-switch: every intent needs English, romanised Hindi/Marathi **and**
  Devanagari keywords, because `hi-IN` dictation returns Devanagari.
- A recognised command is always shown for confirmation before anything is added
  to a cart or posted.
- **Chrome sends dictated audio to Google for transcription.** That fact is
  stated next to the switch in Profile → Settings, not buried in a policy page.

**Chrome's synthesiser stalls, and it is worse than documented.** Measured on a
real browser, not assumed: a ~62-character utterance takes ~4.7s, and the *third
consecutive* one never completes — no `end` event, no `error`, just silence. The
limit is ~15 seconds of **cumulative** speech across a session, not per
utterance. `pause()`/`resume()` keepalive was tried and made no difference.
`speak()` therefore does three things together, and all three are needed:

  1. chunks text (`chunkForSpeech`, 110 chars) so no utterance is long,
  2. calls `cancel()` between chunks, which was measured to reset the engine, and
  3. runs a per-chunk watchdog so a stall can never leave a button stuck on
     "speaking" — it recovers to the next chunk instead.

With all three, the longest summary the app produces (237 chars, 3 chunks,
24.7s) completes with zero watchdog fires.

**Read-aloud language is not the dictation language.** The summaries in
`utils/speech.js` are generated in English, so `SpeakButton` defaults to
`en-IN`. The setting in Profile → Settings governs *dictation* only.

### Offline and installability

The target user opens this in a market on one bar of signal, so the app is a PWA
and the offline path is a first-class feature rather than a nicety.

- **[public/sw.js](public/sw.js)** — hand-written, no Workbox. Navigations are
  network-first falling back to the cached shell under `'/'` (every SPA route
  returns the same HTML, so one entry serves them all); `/assets/*` is cache-first
  because Vite fingerprints those names; images are cache-first and capped at 60
  entries; Google Fonts are stale-while-revalidate. Bump `CACHE_VERSION` when the
  rules change — `activate` deletes every cache that doesn't match.
- **It never calls `skipWaiting()` on install.** Replacing the worker mid-session
  can leave a running page requesting chunks that no longer exist. The new worker
  waits, `ConnectionStatus` offers a refresh, and only then does a `SKIP_WAITING`
  message activate it. `offline.e2e.mjs` asserts this, so don't "simplify" it.
- **Registration is production-only** ([src/utils/serviceWorker.js](src/utils/serviceWorker.js)).
  A worker caching Vite's dev modules breaks hot reload in a way that looks like
  your edits are being ignored, and costs an hour before anyone suspects it.
- **[useNetworkStatus](src/hooks/useNetworkStatus.js)** treats `navigator.onLine`
  as reliable only when false. It reports whether an interface is up, not whether
  anything is reachable, so the copy says "no connection" and never claims the
  connection is good.
- **[ConnectionStatus](src/components/ui/ConnectionStatus.jsx)** owns both the
  offline notice and the update prompt — one slot, offline wins. It sits
  bottom-left to clear `FloatingCartButton` at bottom-right.
- **Offline covers reading only.** There is no backend here, so nothing queues
  writes for replay. Do not add copy implying an offline order will send later.
- **Icons** are generated from [public/icon.svg](public/icon.svg) by
  `npm run icons`, which drives your installed Chrome (the same approach as the
  e2e suites) rather than adding an image dependency. Edit the SVG, never the PNGs.
- **Manifest shortcuts are role-specific** — "Find work" points at a karigar
  route. A vendor who taps it gets sent to their own home by the route guard,
  which is the correct existing behaviour, not a bug to fix in the manifest.
- **Deploy configs carry the cache headers** the worker depends on: `/sw.js` and
  `/index.html` must stay `max-age=0, must-revalidate`, or a deploy can sit unseen
  behind a cached worker.

### Vyapaar Readiness Score

[src/data/vyapaar.js](src/data/vyapaar.js) computes a score from platform activity. It is deliberately **not** a credit score, and the wording must stay that way:

- Apna Mandi is not an RBI-licensed credit information company, so this must never be presented as a credit score, and the card carries a disclaimer saying it does not affect CIBIL/Experian/Equifax/CRIF.
- Apna Mandi is not a lender. Do not add "pre-approved" amounts, interest rates, or offers. The only lending action is consent to share the record with named regulated lenders, who decide for themselves.
- If a real lending flow is ever added it needs a named RBI-registered lender, a Key Fact Statement, APR (not "% per month"), a cooling-off period, and a grievance contact.

### Path aliases and build

[jsconfig.json](jsconfig.json) sets `baseUrl: "./src"` and `vite-tsconfig-paths` is wired into [vite.config.mjs](vite.config.mjs), so imports work relative or absolute-from-src. Build outputs to `dist/` (committed to the repo — production builds show as tracked changes).

## Mock data & demo auth

[src/pages/authentication-login-register/index.jsx](src/pages/authentication-login-register/index.jsx) hardcodes demo phone/OTP pairs per user type and validates them client-side — there is no real OTP or auth backend:

| Role | Phone | OTP |
|---|---|---|
| Vendor | 9876543210 | 123456 |
| Karigar | 9876543212 | 111111 |
| Supplier | 9876543211 | 654321 |

`.env` declares keys for Supabase, OpenAI, Gemini, Anthropic, Stripe, etc., but none are read via `import.meta.env` anywhere in `src/` — treat backend work as net-new rather than "wiring up an existing client."

## Notes

- `package.json` has a `rocketCritical` block listing dependencies that must not be removed — this project was scaffolded via Rocket/DhiWise tooling. Note that `redux` and `@reduxjs/toolkit` are listed there but are **not imported anywhere**; they are kept only to honour that block.
- Deployment targets are Netlify ([netlify.toml](netlify.toml)) and Vercel ([vercel.json](vercel.json)), both SPA rewrites to `index.html`.
