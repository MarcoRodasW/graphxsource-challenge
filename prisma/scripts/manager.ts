import * as fs from 'fs/promises';
import * as path from 'path';
import * as process from 'process';

async function getAvailableScripts(): Promise<string[]> {
  const scriptsDir = path.join(__dirname);

  try {
    const files = await fs.readdir(scriptsDir);

    const scripts = files
      .filter((file) => file.endsWith('.ts') && file !== 'manager.ts')
      .sort();

    return scripts;
  } catch (error) {
    console.error('Error reading scripts directory:', error);
    return [];
  }
}

async function executeScript(scriptName: string): Promise<void> {
  const scriptsDir = path.join(__dirname);

  const normalizedScriptName = scriptName.endsWith('.ts')
    ? scriptName
    : `${scriptName}.ts`;

  const scriptPath = path.join(scriptsDir, normalizedScriptName);

  try {
    await fs.access(scriptPath);

    console.log(`\n▶ Running: ${normalizedScriptName}`);

    const { pathToFileURL } = await import('url');
    await import(pathToFileURL(scriptPath).href);

    console.log(`✓ Completed: ${normalizedScriptName}`);
    process.exit(0);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(
        `\n✗ Error: Script '${normalizedScriptName}' not found in prisma/scripts\n`,
      );

      const availableScripts = await getAvailableScripts();
      if (availableScripts.length > 0) {
        console.error('Available scripts:');
        availableScripts.forEach((s) =>
          console.error(`  - ${s.replace('.ts', '')}`),
        );
        console.error(
          `\nTip: Run the script using: pnpm run db:script <script-name>`,
        );
      } else {
        console.error('No scripts are currently available in prisma/scripts');
      }
    } else if ((error as NodeJS.ErrnoException).code === 'EACCES') {
      console.error(
        `\n✗ Error: Permission denied accessing script '${normalizedScriptName}'`,
      );
      console.error(
        'Tip: Check file permissions and ensure you have read access',
      );
    } else {
      console.error(`\n✗ Failed: ${normalizedScriptName}\n`);
      console.error('Script execution error:');

      if (error instanceof Error) {
        console.error(`  Message: ${error.message}`);
        if (error.stack) {
          console.error(`\n${error.stack}`);
        }
      } else {
        console.error(`  ${String(error)}`);
      }

      console.error(
        '\nTip: Check the script for syntax errors or runtime issues',
      );
    }
    process.exit(1);
  }
}

async function executeAllScripts(): Promise<void> {
  const scriptsDir = path.join(__dirname);

  const scripts = await getAvailableScripts();

  if (scripts.length === 0) {
    console.log('\nNo scripts found in prisma/scripts');
    console.log(
      'Tip: Add .ts files to the prisma/scripts directory to run them',
    );
    process.exit(0);
  }

  console.log(`\nFound ${scripts.length} script(s) to execute:\n`);

  let completedCount = 0;

  for (const script of scripts) {
    const scriptPath = path.join(scriptsDir, script);

    try {
      console.log(`▶ Running: ${script}`);

      const { pathToFileURL } = await import('url');
      await import(pathToFileURL(scriptPath).href);

      console.log(`✓ Completed: ${script}\n`);
      completedCount++;
    } catch (error) {
      console.error(`\n✗ Failed: ${script}\n`);
      console.error('Script execution error:');

      if (error instanceof Error) {
        console.error(`  Message: ${error.message}`);
        if (error.stack) {
          console.error(`\n${error.stack}`);
        }
      } else {
        console.error(`  ${String(error)}`);
      }

      console.error(
        `\nExecution stopped after ${completedCount} of ${scripts.length} script(s).`,
      );
      console.error('Tip: Fix the failing script and run again to continue');
      process.exit(1);
    }
  }

  console.log(`\n✓ All ${scripts.length} script(s) completed successfully.`);
  process.exit(0);
}

async function main(): Promise<void> {
  try {
    const scriptName = process.argv[2];

    if (!scriptName) {
      await executeAllScripts();
    } else {
      await executeScript(scriptName);
    }
  } catch (error) {
    console.error('\n✗ Unexpected error running script manager:\n');

    if (error instanceof Error) {
      console.error(`  Message: ${error.message}`);
      if (error.stack) {
        console.error(`\n${error.stack}`);
      }
    } else {
      console.error(`  ${String(error)}`);
    }

    console.error(
      '\nTip: This is an unexpected error. Please check the script manager implementation.',
    );
    process.exit(1);
  }
}

void main();
