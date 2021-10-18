#! /usr/bin/env node

import { Command } from 'commander';
import 'dotenv/config';
import commandCollection from './config/commands';
import { createRc } from './config/createRc';

async function initCli() {
  const program = new Command('tss');
  program.version('0.0.1-alpha');

  createRc();

  commandCollection.forEach(command => {
    program.command(command.name).description(command.description).action(command.action);
  });

  await program.parseAsync(process.argv);
}

initCli();
