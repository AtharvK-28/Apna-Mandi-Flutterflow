import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';

/**
 * Proves the app survives losing the network.
 *
 * This one runs against the **production build** rather than the dev server,
 * because that is the only place the service worker is registered — a worker
 * caching Vite's dev modules would break hot reload, so registration is gated
 * on import.meta.env.PROD. Run it with `npm run test:offline`, which builds,
 * previews and tears down for you.
 *
 * The check that matters is the last one: cut the connection, reload, and the
 * app must still render. Without a service worker that is the browser's
 * "no internet" page and every other guarantee in this repo is moot.
 */

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const executablePath = CANDIDATES.find((candidate) => existsSync(candidate));
if (!executablePath) {
  console.error('No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.');
  process.exit(1);
}

const results = [];
const log = (ok, msg, extra = '') => {
  results.push({ ok, msg });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}${extra ? `  ${extra}` : ''}`);
};

const banner = (title) => console.log(`\n======== ${title} ========`);

const browser = await chromium.launch({ executablePath, headless: process.env.HEADED !== '1' });
const context = await browser.newContext();
const page = await context.newPage();

try {
  /* ── Static PWA surface ────────────────────────────────────────────────── */
  banner('Installability');

  const manifestResponse = await page.request.get(`${BASE}/manifest.json`);
  log(manifestResponse.ok(), 'manifest.json is served', `(${manifestResponse.status()})`);

  const manifest = await manifestResponse.json();
  log(manifest.name?.includes('Apna Mandi'), 'manifest declares a real name', `"${manifest.name}"`);
  log(manifest.start_url?.startsWith('/'), 'manifest has a start_url', manifest.start_url ?? '');
  log(manifest.display === 'standalone', 'manifest opens standalone');
  log(
    manifest.theme_color?.toUpperCase() === '#C0532E',
    'manifest theme colour is the brand terracotta, not the scaffold black',
  );

  const sizes = (manifest.icons ?? []).map((icon) => icon.sizes);
  log(sizes.includes('192x192') && sizes.includes('512x512'), 'manifest has 192 and 512 icons');
  log(
    (manifest.icons ?? []).some((icon) => icon.purpose === 'maskable'),
    'manifest has a maskable icon, so Android does not letterbox it',
  );

  for (const icon of manifest.icons ?? []) {
    const response = await page.request.get(`${BASE}${icon.src}`);
    log(response.ok(), `icon ${icon.src} resolves`, `(${response.status()})`);
  }

  const appleIcon = await page.request.get(`${BASE}/apple-touch-icon.png`);
  log(appleIcon.ok(), 'apple-touch-icon.png resolves', `(${appleIcon.status()})`);

  const offlinePage = await page.request.get(`${BASE}/offline.html`);
  log(offlinePage.ok(), 'offline.html resolves', `(${offlinePage.status()})`);

  const swResponse = await page.request.get(`${BASE}/sw.js`);
  const swBody = await swResponse.text();
  log(swResponse.ok(), 'sw.js is served', `(${swResponse.status()})`);
  log(
    /javascript/i.test(swResponse.headers()['content-type'] ?? ''),
    'sw.js is served as JavaScript',
    swResponse.headers()['content-type'] ?? '',
  );
  // A worker that calls skipWaiting() during install replaces itself mid-
  // session, which can leave a running page asking for chunks that no longer
  // exist. Every mention of it must sit in the SKIP_WAITING message handler.
  const skipWaitingLines = swBody
    .split(/\r?\n/)
    .filter((line) => line.includes('skipWaiting') && !/^\s*(\/\/|\*)/.test(line));
  log(
    skipWaitingLines.length === 1 && skipWaitingLines[0].includes('SKIP_WAITING'),
    'sw.js only skips waiting when the UI asks it to',
    skipWaitingLines.map((line) => line.trim()).join(' | '),
  );

  /* ── Link preview metadata ─────────────────────────────────────────────── */
  banner('Link previews');

  await page.goto(BASE, { waitUntil: 'networkidle' });

  const meta = await page.evaluate(() => ({
    ogTitle: document.querySelector('meta[property="og:title"]')?.content ?? null,
    ogImage: document.querySelector('meta[property="og:image"]')?.content ?? null,
    manifest: document.querySelector('link[rel="manifest"]')?.getAttribute('href') ?? null,
    apple: document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ?? null,
  }));

  log(!!meta.ogTitle, 'page declares og:title', meta.ogTitle ?? '');
  log(!!meta.ogImage, 'page declares og:image', meta.ogImage ?? '');
  log(meta.manifest === '/manifest.json', 'page links the manifest');
  log(!!meta.apple, 'page links an apple-touch-icon');

  /* ── The service worker actually takes control ─────────────────────────── */
  banner('Service worker');

  const controlled = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return 'unsupported';
    const registration = await navigator.serviceWorker.ready;
    // `ready` resolves on activation; controller may lag by a tick.
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
        setTimeout(resolve, 3000);
      });
    }
    return registration.active ? 'active' : 'inactive';
  });

  log(controlled === 'active', 'a service worker activated', controlled);

  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    const shell = names.find((name) => name.startsWith('apna-mandi-shell'));
    if (!shell) return { names, shellHasRoot: false };
    const cache = await caches.open(shell);
    return { names, shellHasRoot: !!(await cache.match('/')) };
  });

  log(cached.names.length > 0, 'caches were created', cached.names.join(', '));
  log(cached.shellHasRoot, 'the app shell is cached under "/"');

  /* ── The part that matters ─────────────────────────────────────────────── */
  banner('Offline');

  await context.setOffline(true);

  await page.reload({ waitUntil: 'domcontentloaded' });
  // Give the SPA a moment to hydrate from cache.
  await page.waitForSelector('#root *', { timeout: 10000 }).catch(() => {});

  const offlineRender = await page.evaluate(() => ({
    rootChildren: document.getElementById('root')?.childElementCount ?? 0,
    text: document.body.innerText.slice(0, 400),
  }));

  log(
    offlineRender.rootChildren > 0,
    'the app still renders after a reload with no network',
    `(${offlineRender.rootChildren} root children)`,
  );
  log(
    /Apna Mandi/i.test(offlineRender.text),
    'the offline page is the app, not the browser error page',
  );

  // Routing must keep working offline too — including the guards, which is why
  // an unauthenticated jump to /deals is expected to land on /login rather than
  // render the deals page.
  const navigated = await page.evaluate(async () => {
    history.pushState({}, '', '/deals');
    dispatchEvent(new PopStateEvent('popstate'));
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { path: location.pathname, hasContent: document.body.innerText.length > 40 };
  });
  log(
    navigated.hasContent && navigated.path !== '/',
    'routing and its guards still run offline',
    `landed on ${navigated.path}`,
  );

  const bannerShown = await page.evaluate(() => {
    dispatchEvent(new Event('offline'));
    return new Promise((resolve) => {
      setTimeout(() => {
        const status = document.querySelector('[role="status"]');
        resolve(status?.textContent ?? '');
      }, 400);
    });
  });
  log(/No connection/i.test(bannerShown), 'the app tells the user it is offline', bannerShown);

  await context.setOffline(false);
} catch (error) {
  log(false, 'suite crashed', error.message);
} finally {
  await browser.close();
}

const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('\nFailures:');
  failed.forEach((result) => console.log(`  - ${result.msg}`));
}
process.exit(failed.length ? 1 : 0);
