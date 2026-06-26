import { spawn } from 'node:child_process';
import net from 'node:net';

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const servers = [
  {
    name: 'client',
    command: pnpmCommand,
    args: ['--filter', 'client', 'start'],
    host: '127.0.0.1',
    port: 3000,
  },
  {
    name: 'market-owner',
    command: pnpmCommand,
    args: ['--filter', 'market-owner', 'preview'],
    host: '127.0.0.1',
    port: 5173,
  },
];

const children = [];
let shuttingDown = false;

const waitForPort = ({ host, port, timeoutMs = 120_000 }) => {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = net.connect({ host, port });

      socket.once('connect', () => {
        socket.end();
        resolve();
      });

      socket.once('error', () => {
        socket.destroy();

        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for ${host}:${port}.`));
          return;
        }

        setTimeout(tryConnect, 500);
      });
    };

    tryConnect();
  });
};

const stopServers = () => {
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
};

for (const server of servers) {
  const child = spawn(server.command, server.args, {
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  children.push(child);

  child.stdout.on('data', (chunk) => process.stdout.write(`[${server.name}] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[${server.name}] ${chunk}`));

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return;
    }

    console.error(
      `[${server.name}] exited before Lighthouse CI finished. code=${code ?? 'null'} signal=${
        signal ?? 'null'
      }`,
    );
    stopServers();
    process.exit(code ?? 1);
  });
}

try {
  await Promise.all(servers.map((server) => waitForPort(server)));
  console.log('LHCI servers ready');
} catch (error) {
  console.error(error);
  stopServers();
  process.exit(1);
}

process.on('SIGINT', () => {
  stopServers();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopServers();
  process.exit(0);
});
