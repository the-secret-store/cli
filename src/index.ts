#! /usr/bin/env node

import { exec } from 'child_process';
import { Command } from 'commander';
import 'dotenv/config';
import pc from 'picocolors';
import commandCollection from './config/commands';
import { createRc } from './config/createRc';
import { refreshTokens } from './services/auth.service';

async function initCli() {
  const program = new Command('tss');
  program.version('0.0.1-alpha');

  process.on('SIGINT', () => {
    console.info(pc.yellow('Interrupt'));
    process.exit(0);
  });

  createRc();

  commandCollection.forEach(command => {
    program.command(command.name).description(command.description).action(command.action);
  });

  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    const err = <Error>error;
    if (err.name === 'TokenExpiredError' || err.message.includes('expired')) {
      await refreshTokens();
      return exec(`tss ${program.args.join(' ')}`);
    }
    console.error(pc.red(`${err.name}: ${err.message}`));
    err.stack && console.warn(pc.yellow(err.stack));
  }
}

initCli();
