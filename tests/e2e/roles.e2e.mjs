import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';

/**
 * End-to-end check that the three roles really are separated.
 *
 * The unit tests cover the guard logic in isolation; this drives an actual
 * browser through a real login for each role and then tries to walk into the
 * other roles' routes by URL, which is the thing that was broken before guards
 * existed. Run with `npm run test:e2e` (starts and stops the dev server for
 * you) or point BASE_URL at an already-running instance.
 */

const BASE = process.env.BASE_URL ?? 'http://localhost:4028';

// playwright-core ships no browser of its own, so use one already installed.
// Node accepts forward slashes on Windows too, which avoids backslashes being
// eaten as escape sequences inside a JS string literal.
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
  console.error(
    'No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser executable.',
  );
  process.exit(1);
}

const CREDS = {
  vendor:   { phone: '9876543210', otp: '123456', home: '/home' },
  karigar:  { phone: '9876543212', otp: '111111', home: '/karigar/find-work' },
  supplier: { phone: '9876543211', otp: '654321', home: '/supplier' },
};

// Routes each role must NOT be able to reach by typing the URL.
const FORBIDDEN = {
  vendor:   ['/supplier', '/karigar/find-work', '/karigar/earnings'],
  karigar:  ['/dashboard', '/cart', '/deals', '/supplier', '/karigar-connect'],
  supplier: ['/dashboard', '/cart', '/karigar-connect', '/karigar/find-work'],
};

const banner = (title) => {
  console.log('');
  console.log('======== ' + title + ' ========');
};

const results = [];
const log = (ok, msg) => { results.push({ ok, msg }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); };

const browser = await chromium.launch({ executablePath, headless: process.env.HEADED !== '1' });

async function registerFields(page) {
  const FIELD = 'input[type="text"], input[type="number"], input[type="tel"], textarea';

  // Read every field's metadata in one pass. Holding element handles across
  // awaits goes stale whenever React re-renders the form, which made this hang.
  const fields = await page.$$eval(FIELD, (nodes) =>
    nodes
      .map((node, index) => ({
        index,
        placeholder: node.placeholder || '',
        type: node.type,
        maxLength: node.maxLength,
        visible: !!node.offsetParent,
      }))
      .filter((f) => f.visible),
  );

  const valueFor = ({ placeholder, type, maxLength }) => {
    if (maxLength === 14 || /fssai/i.test(placeholder)) return '12345678901234';
    if (type === 'number') return '200';
    if (/name/i.test(placeholder)) return 'Asha Patil';
    if (/market|sector|location|address|area/i.test(placeholder)) return 'Dadar Market, Mumbai';
    if (/tomato|ingredient/i.test(placeholder)) return 'Onions, Potatoes, Spices';
    if (/skill|dosa|chaat/i.test(placeholder)) return 'Dosa Making, Chaat Assembly';
    return 'Test value';
  };

  for (const field of fields) {
    await page.locator(FIELD).nth(field.index).fill(valueFor(field), { timeout: 5000 })
      .catch(() => {});
  }

  // Custom Selects: walk by index. Picking ".first()" each pass just re-opens
  // the one already filled, since aria-expanded returns to false after a pick.
  const triggers = page.locator('button[aria-haspopup="listbox"]');
  const count = await triggers.count();
  for (let i = 0; i < count; i += 1) {
    const trigger = triggers.nth(i);
    if (!(await trigger.isVisible().catch(() => false))) continue;
    await trigger.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(200);

    const option = page.locator('[role="option"]:not([aria-disabled="true"])').first();
    if (await option.count()) await option.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(150);

    // Multi-selects stay open by design; close via Done, else Escape.
    const done = page.getByRole('button', { name: /^done$/i });
    if (await done.count()) await done.first().click({ timeout: 5000 }).catch(() => {});
    else await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(150);
  }
}

/**
 * Signs in as `role`, completing registration if this browser context has never
 * registered before. Returns the path actually landed on.
 */
async function signIn(page, role) {
  const cred = CREDS[role];

  if (new URL(page.url()).pathname !== '/login') {
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  }

  await page.getByRole('button', { name: new RegExp(`^${role}$`, 'i') }).first().click();
  await page.locator('input[type="tel"]').fill(cred.phone);
  await page.getByRole('button', { name: /send otp/i }).click();
  await page.waitForTimeout(1900);

  const autofill = page.getByRole('button', { name: /^(autofill|भरें)$/i });
  if (await autofill.count()) {
    await autofill.first().click();
  } else {
    const boxes = page.locator('input[maxlength="1"]');
    for (let i = 0; i < cred.otp.length; i += 1) await boxes.nth(i).fill(cred.otp[i]);
  }
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /verify/i }).click();
  await page.waitForTimeout(1900);

  if (new URL(page.url()).pathname !== cred.home) {
    await registerFields(page);
    await page.getByRole('button', { name: /complete registration/i }).click().catch(() => {});
    await page.waitForTimeout(2600);
  }

  return new URL(page.url()).pathname;
}

for (const [role, cred] of Object.entries(CREDS)) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).split('\n')[0]));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)); });

  banner(role.toUpperCase());

  // 1. Unauthenticated visit to a gated route must land on /login.
  await page.goto(`${BASE}${cred.home}`, { waitUntil: 'networkidle' });
  log(new URL(page.url()).pathname === '/login',
      `signed-out visit to ${cred.home} redirects to /login (got ${new URL(page.url()).pathname})`);

  // 2. Log in as this role.
  const landed = await signIn(page, role);
  if (landed !== cred.home) {
    const msgs = (await page.locator('p.text-destructive, p.text-sm.text-destructive').allInnerTexts())
      .map((t) => t.trim()).filter(Boolean);
    if (msgs.length) console.log(`      validation still blocking: ${msgs.join(' | ')}`);
  }
  log(landed === cred.home, `${role} lands on ${cred.home} after login (got ${landed})`);

  // 3. Nav shows only this role's items.
  const navLabels = (await page.locator('header nav a').allInnerTexts()).map((t) => t.trim());
  console.log(`      nav: [${navLabels.join(', ')}]`);

  const leaks = {
    vendor: [], karigar: ['Deals', 'Dashboard', 'Virasaat', 'Exchange', 'Hire'],
    supplier: ['Deals', 'Dashboard', 'Virasaat', 'Hire'],
  }[role].filter((l) => navLabels.includes(l));
  log(leaks.length === 0, `${role} nav has no cross-role links${leaks.length ? ` (leaked: ${leaks})` : ''}`);

  // 4. Forbidden routes bounce back to the role's own home.
  for (const route of FORBIDDEN[role]) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    const now = new URL(page.url()).pathname;
    log(now !== route, `${role} blocked from ${route} → ${now}`);
  }

  // 5. Cart button must not exist for non-buyers.
  await page.goto(`${BASE}${cred.home}`, { waitUntil: 'networkidle' });
  const cartVisible = await page.locator('a[aria-label*="Cart"]').count();
  log(role === 'vendor' || cartVisible === 0,
      `${role}: floating cart ${cartVisible ? 'present' : 'absent'}`);

  const real = errors.filter((e) => !/favicon|manifest|404 \(Not Found\)/i.test(e));
  log(real.length === 0, `${role}: no runtime errors${real.length ? ` — ${real.slice(0, 3).join(' | ')}` : ''}`);

  await ctx.close();
}

// The skip link is the first stop in the tab order and must point at a target
// that actually exists on the page it is shown on.
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  banner('ACCESSIBILITY & GUEST');

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /continue as guest/i }).click();
  // Wait for the guest home to actually render before asserting anything about
  // it — reading the DOM mid-swap picked up the login page's markup.
  await page.waitForURL(`${BASE}/home`, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await page.locator('header nav a').first().waitFor({ timeout: 10000 });

  log(
    new URL(page.url()).pathname === '/home',
    `guest reaches /home (got ${new URL(page.url()).pathname})`,
  );

  // A guest has no account, so the greeting must not name a person. Scoped to
  // the greeting itself: "Rajesh Corner" is a real stall in the gig list below,
  // so searching the whole page would flag legitimate content.
  const greeting = (await page.getByRole('heading', { name: /namaste/i }).innerText()).trim();
  log(greeting === 'Namaste', `guest greeting names nobody (got "${greeting}")`);
  log(
    (await page.getByRole('link', { name: /^sign in$/i }).count()) > 0,
    'guest is offered a way to sign in',
  );

  // Focus the document body first so Tab starts from a known place.
  await page.evaluate(() => document.body.focus());
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => ({
    cls: document.activeElement?.className?.toString() ?? '',
    text: document.activeElement?.textContent?.trim() ?? '',
  }));
  log(
    focused.cls.includes('skip-link') || /skip to content/i.test(focused.text),
    `first Tab reaches the skip link (got "${focused.text.slice(0, 30)}")`,
  );

  for (const route of ['/home', '/deals', '/khau-galli']) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    const count = await page.locator('#main-content').count();
    log(count === 1, `skip-link target exists on ${route} (found ${count})`);
  }

  await ctx.close();
}

// Voice affordances must appear where dictation is available and be absent
// where it is not — a mic button that cannot work is worse than none.
{
  const ctx = await browser.newContext({ permissions: [] });
  const page = await ctx.newPage();
  banner('VOICE');

  // Chromium supports webkitSpeechRecognition, so mics should be present.
  const supportsDictation = await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
    .then(() => page.evaluate(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition)));
  log(supportsDictation, 'test browser reports dictation support');

  await signIn(page, 'karigar');

  const micCount = await page.getByRole('button', { name: /dictate a search/i }).count();
  log(micCount === 1, `job search offers a mic (found ${micCount})`);

  // Read-aloud must be reachable for a shift's pay and timing.
  await page.locator('article button').first().click();
  await page.waitForTimeout(500);
  const speakCount = await page.getByRole('button', { name: /read this shift aloud/i }).count();
  log(speakCount === 1, `gig details offers read-aloud (found ${speakCount})`);

  // The mic must not silently hold the microphone open after the dialog closes.
  await page.getByRole('button', { name: /close dialog/i }).click();
  await page.waitForTimeout(300);
  const strayListening = await page.locator('[aria-pressed="true"][aria-label*="Stop dictating"]').count();
  log(strayListening === 0, 'no microphone left listening after closing the dialog');

  await page.goto(`${BASE}/karigar/earnings`, { waitUntil: 'networkidle' });
  const earningsSpeak = await page.getByRole('button', { name: /read your earnings aloud/i }).count();
  log(earningsSpeak === 1, `earnings offers read-aloud (found ${earningsSpeak})`);

  await ctx.close();
}

// Legacy aliases must redirect, not render a second copy of the page.
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  banner('LEGACY ALIASES');
  for (const [from, to] of [['/vendor-dashboard', '/dashboard'], ['/deal-discovery-shopping', '/deals'],
                            ['/shopping-cart-checkout', '/cart'], ['/supplier-dashboard', '/supplier'],
                            ['/order-tracking-history', '/orders']]) {
    await page.goto(`${BASE}${from}`, { waitUntil: 'networkidle' });
    const now = new URL(page.url()).pathname;
    log(now !== from, `${from} no longer renders (→ ${now})`);
  }
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log('');
console.log(`${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) { failed.forEach((f) => console.log(`  FAILED: ${f.msg}`)); process.exit(1); }
