#!/usr/bin/env node

const { spawn } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const projects = [
  { name: 'cointracker-mock-api', label: 'Mock API' },
  { name: 'cointracker-app', label: 'Frontend' }
];

async function runOnce(args, cwd) {
  await new Promise((resolve, reject) => {
    const child = spawn(npmCommand, args, {
      cwd,
      stdio: 'inherit',
      env: process.env
    });

    child.on('close', (code, signal) => {
      if (signal) {
        reject(
          new Error(
            `npm ${args.join(' ')} in ${path.basename(cwd)} terminated with signal ${signal}`
          )
        );
        return;
      }

      if (code !== 0) {
        reject(
          new Error(
            `npm ${args.join(' ')} in ${path.basename(cwd)} exited with code ${code}`
          )
        );
        return;
      }

      resolve();
    });
  });
}

async function installDependencies() {
  for (const project of projects) {
    const cwd = path.join(rootDir, project.name);
    console.log(`\n▶ Installing dependencies for ${project.label} (${project.name})`);
    await runOnce(['install'], cwd);
  }
}

function startDevServers() {
  const children = projects.map((project) => {
    const cwd = path.join(rootDir, project.name);
    console.log(`\n▶ Starting ${project.label} dev server`);

    const child = spawn(npmCommand, ['run', 'dev'], {
      cwd,
      stdio: 'inherit',
      env: process.env
    });

    child.__project = project;
    return child;
  });

  let shuttingDown = false;

  const shutdown = (signal = 'SIGINT') => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    for (const child of children) {
      if (!child.killed) {
        child.kill(signal);
      }
    }
  };

  process.on('SIGINT', () => {
    shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    shutdown('SIGTERM');
  });

  const waiters = children.map(
    (child, index) =>
      new Promise((resolve) => {
        child.on('close', (code, signal) => {
          resolve({ index, code, signal });
        });
      })
  );

  return { waiters, shutdown, children };
}

async function main() {
  await installDependencies();

  const { waiters, shutdown, children } = startDevServers();

  const firstResult = await Promise.race(waiters);

  if (!firstResult) {
    return;
  }

  const { index, code, signal } = firstResult;
  const { label } = children[index].__project;

  if (signal && signal !== 'SIGINT' && signal !== 'SIGTERM') {
    console.error(`\n⚠ ${label} exited due to signal ${signal}. Stopping remaining processes.`);
  } else if (typeof code === 'number') {
    if (code !== 0) {
      console.error(`\n⚠ ${label} exited with code ${code}. Stopping remaining processes.`);
    } else {
      console.log(`\nℹ ${label} exited. Stopping remaining processes.`);
    }
  }

  shutdown(signal);
  await Promise.all(waiters);

  if (typeof code === 'number' && code !== 0) {
    process.exit(code);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
