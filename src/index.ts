#! /usr/bin/env node

import { Command } from 'commander';
import 'dotenv/config';
import commandCollection from './config/commands';
import { initCli } from './config/initCli';

const program = new Command('tss');
program.version('0.0.1-alpha');

initCli();

commandCollection.forEach(command => {
  program.command(command.name).description(command.description).action(command.action);
});

program.parse(process.argv);
