import { exec } from 'child_process';
import * as chalk from 'chalk';
import { logOutput } from './helpers.js';

require('dotenv').config();

// VALIDATE ARGS
const error = `\n\n${chalk.yellow('Usage')}: npm run pgm:run ${chalk.green('<up|down|show>')}\n\n`;
if (process.argv.length !== 3) {
  console.error(error);
  process.exit(1);
}

const supportedCommands = ['up', 'down', 'show'];
const input = process.argv[2];

if (!supportedCommands.includes(input)) {
  console.error(error);
  process.exit(1);
}

// RUN COMMANDS
runCommand(input);

function runCommand(inputCommand: string) {
  const realCommand = inputCommand === 'up' ? 'run' : inputCommand === 'down' ? 'revert' : inputCommand;

  exec(`typeorm migration:${realCommand} -d dist/infrastructure/database/typeorm.config.js`, logOutput);
}
