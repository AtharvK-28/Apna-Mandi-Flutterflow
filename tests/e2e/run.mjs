import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

/**
 * Boots the dev server through Vite's own API, runs the end-to-end suite
 * against it, then shuts it down — so `npm run test:e2e` works from a cold
 * repo without anyone remembering to start Vite first.
 *
 * Using the API rather than spawning `npm start` avoids two Windows traps:
 * `npm` is a .cmd shim that Node refuses to spawn without a shell, and Vite's
 * package exports do not expose its bin script.
 */

const server = await createServer({ server: { host: '127.0.0.1' } });
await server.listen();

const address = server.httpServer.address();
const base = `http://127.0.0.1:${address.port}`;

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

process.stdout.write(`Dev server listening on ${base}\nRunning end-to-end checks.\n\n`);

const exitCode = await new Promise((resolve) => {
  const suite = spawn(
    process.execPath,
    [fileURLToPath(new URL('./roles.e2e.mjs', import.meta.url))],
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
