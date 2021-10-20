#! /usr/bin/env node

import { Command } from 'commander';
import 'dotenv/config';
import pc from 'picocolors';
import commandCollection from './config/commands';
import { createRc } from './config/createRc';

async function initCli() {
  const program = new Command('tss');
  program.version('0.0.1-alpha');

  createRc();

  commandCollection.forEach(command => {
    program.command(command.name).description(command.description).action(command.action);
  });

  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    const err = <Error>error;
    console.error(pc.red(`${err.name}: ${err.message}`));
    err.stack && console.warn(pc.yellow(err.stack));
  }
}

initCli();
