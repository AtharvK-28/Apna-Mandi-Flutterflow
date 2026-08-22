import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'vite';

/**
 * Builds the app, serves the build, and runs the offline suite against it.
 *
 * The offline checks cannot use the dev server: the service worker is only
 * registered in a production build, and Vite's dev server serves unbundled
 * modules that the caching rules were never written for. So this does the whole
 * cycle — build, preview, test, shut down — in one command.
 */

process.stdout.write('Building for production.\n');
await build({ logLevel: 'warn' });

const server = await preview({ preview: { host: '127.0.0.1', port: 4173, strictPort: false } });
const base = server.resolvedUrls?.local?.[0]?.replace(/\/$/, '') ?? 'http://127.0.0.1:4173';

const shutdown = async () => {
  try {
    await server.close();
  } catch {
    // Already closing.
  }
};

process.on('SIGINT', async () => {
  await shutdown();
  process.exit(130);
});

process.stdout.write(`Preview server listening on ${base}\nRunning offline checks.\n`);

const exitCode = await new Promise((resolve) => {
  const suite = spawn(
    process.execPath,
    [fileURLToPath(new URL('./offline.e2e.mjs', import.meta.url))],
    { stdio: 'inherit', env: { ...process.env, BASE_URL: base } },
  );
  suite.on('close', resolve);
  suite.on('error', (error) => {
    console.error(error);
    resolve(1);
  });
});

await shutdown();
process.exit(exitCode ?? 1);
