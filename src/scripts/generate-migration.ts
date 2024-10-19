import { exec } from 'child_process';
import * as chalk from 'chalk';
import { logOutput } from './helpers.js';

if (process.argv.length !== 3) {
  console.error(`\n${chalk.yellow('Usage')}: npm run pgm:generate ${chalk.green('<filename>')}\n\n`);
  process.exit(1);
}

const fileName = process.argv[2];
generateMigrationFile(fileName);

function generateMigrationFile(fileName: string) {
  const migrationName = fileName.replace(/\.[^/.]+$/, '');

  exec(
    `typeorm migration:generate src/infrastructure/database/migrations/${migrationName} -d dist/infrastructure/database/typeorm.config.js`,
    logOutput,
  );
}
