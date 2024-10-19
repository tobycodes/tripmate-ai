import { exec } from 'child_process';
import * as chalk from 'chalk';
import { logOutput } from './helpers';

if (process.argv.length !== 3) {
  console.error(`\n${chalk.yellow('Usage')}: npm run pgm:create ${chalk.green('<filename>')}\n\n`);
  process.exit(1);
}

const fileName = process.argv[2];
generateMigrationFile(fileName);

function generateMigrationFile(fileName: string) {
  const migrationName = fileName.replace(/\.[^/.]+$/, '');
  exec(`typeorm migration:create src/infrastructure/database/migrations/${migrationName}`, logOutput);
}
