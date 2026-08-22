import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

/**
 * Renders the brand SVGs to the PNG sizes a manifest and an iOS home screen
 * actually need.
 *
 * Run it with `npm run icons` after editing public/icon.svg. The PNGs are
 * committed, so a normal build and deploy never needs a browser — this only
 * exists so the raster icons can be regenerated from the vector source rather
 * than hand-edited and drifting away from it.
 *
 * It drives the Chrome already installed on the machine (same approach as the
 * end-to-end suite) rather than pulling in an image-processing dependency.
 */

const publicDir = new URL('../public/', import.meta.url);

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const executablePath = CANDIDATES.find((candidate) => existsSync(candidate));
if (!executablePath) {
  console.error('No Chrome or Edge found. Install one, or edit CANDIDATES in this script.');
  process.exit(1);
}

// source SVG → [ [output name, pixel size], ... ]
const TARGETS = [
  ['icon.svg', [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]],
  ['icon-maskable.svg', [['icon-maskable-512.png', 512]]],
];

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage();

for (const [source, outputs] of TARGETS) {
  const svg = readFileSync(fileURLToPath(new URL(source, publicDir)), 'utf8');

  for (const [name, size] of outputs) {
    await page.setViewportSize({ width: size, height: size });
    // margin:0 matters — any default body margin shifts the mark off-centre,
    // which on a maskable icon pushes it outside the safe circle.
    await page.setContent(
      `<!doctype html><style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
    );
    const png = await page.screenshot({ omitBackground: true });
    writeFileSync(fileURLToPath(new URL(name, publicDir)), png);
    console.log(`${name.padEnd(24)} ${size}x${size}  ${(png.length / 1024).toFixed(1)} KB`);
  }
}

await browser.close();
