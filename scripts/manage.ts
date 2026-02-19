#!/usr/bin/env node
import { mkdir, readdir, rm, writeFile, access } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { createInterface } from 'node:readline';
import { spawn } from 'node:child_process';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const runCommand = (cmd: string, args: string[]): Promise<number> => {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      resolve(code || 0);
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
};

async function getE2EFiles(): Promise<string[]> {
  const e2eDir = join(process.cwd(), 'apps/playground/e2e');
  try {
    const files = await readdir(e2eDir);
    return files
      .filter((f) => f.endsWith('.yaml'))
      .map((f) => f.replace('.yaml', ''));
  } catch {
    return [];
  }
}

async function runE2ETests(testName?: string) {
  const e2eFiles = await getE2EFiles();

  if (e2eFiles.length === 0) {
    console.error('❌ No e2e test files found in apps/playground/e2e/');
    process.exit(1);
  }

  let selectedTest: string;

  if (testName) {
    if (e2eFiles.includes(testName)) {
      selectedTest = testName;
    } else {
      console.error(`❌ Test "${testName}" not found.`);
      console.log(`\nAvailable tests: ${e2eFiles.join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('\n🧪 E2E Test Runner\n');
    console.log('Available tests:');
    e2eFiles.forEach((file, idx) => {
      console.log(`${idx + 1}. ${file}`);
    });
    console.log(`${e2eFiles.length + 1}. all (run all tests)`);
    console.log('0. Cancel\n');

    const answer = await ask('Select test to run: ');
    const choice = parseInt(answer.trim());

    if (choice === 0) {
      console.log('Cancelled.');
      rl.close();
      process.exit(0);
    }

    if (choice === e2eFiles.length + 1) {
      selectedTest = 'all';
    } else if (choice >= 1 && choice <= e2eFiles.length) {
      selectedTest = e2eFiles[choice - 1];
    } else {
      console.error('❌ Invalid selection.');
      rl.close();
      process.exit(1);
    }
  }

  rl.close();

  console.log(
    `\n🚀 Running ${selectedTest === 'all' ? 'all tests' : selectedTest}...\n`,
  );

  let exitCode: number;
  if (selectedTest === 'all') {
    exitCode = await runCommand('maestro', ['test', 'apps/playground/e2e/']);
  } else {
    exitCode = await runCommand('maestro', [
      'test',
      `apps/playground/e2e/${selectedTest}.yaml`,
    ]);
  }

  process.exit(exitCode);
}

async function createNewPackage() {
  const packageName = await ask('Enter package name: ');

  if (!packageName) {
    rl.close();
    return;
  }

  const safeName = packageName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const scope = '@base-ui-rn';
  const fullPackageName = `${scope}/${safeName}`;
  const packageDir = join(process.cwd(), 'packages', safeName);

  try {
    await access(packageDir);
    console.error(`Error: packages/${safeName} already exists.`);
    rl.close();
    return;
  } catch {}

  try {
    await mkdir(packageDir, { recursive: true });
    await mkdir(join(packageDir, 'src'), { recursive: true });

    const packageJson = {
      name: fullPackageName,
      version: '0.0.0',
      description: `Headless ${safeName} primitive for React Native`,
      license: 'MIT',
      author: 'Abdelrahman',
      type: 'module',
      main: './src/index.ts',
      types: './src/index.ts',
      scripts: {
        lint: 'eslint . --fix && tsc --noEmit',
      },
      dependencies: {},
      peerDependencies: {
        react: '>=19.1.0',
        'react-native': '>=0.81.5',
      },
      devDependencies: {
        [`${scope}/eslint-config`]: 'workspace:*',
        '@types/jest': '^30.0.0',
        '@types/node': '^22.0.0',
        '@types/react': '^19.0.0',
        react: '19.1.0',
        'react-native': '0.81.5',
        typescript: '^5.9.3',
      },
    };

    const tsconfig = {
      $schema: 'https://json.schemastore.org/tsconfig',
      compilerOptions: {
        target: 'ESNext',
        module: 'ESNext',
        moduleResolution: 'Node',
        jsx: 'react-native',
        lib: ['ESNext'],
        declaration: true,
        declarationMap: true,
        rootDir: 'src',
        outDir: 'dist',
        isolatedModules: true,
        esModuleInterop: true,
        skipLibCheck: true,
        strict: true,
        baseUrl: '.',
        paths: {
          '@/*': ['src/*'],
        },
        types: ['node', 'jest'],
      },
      exclude: ['node_modules', 'dist', '**/__tests__', '**/*.test.tsx'],
      include: ['src'],
    };

    await writeFile(
      join(packageDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
    );
    await writeFile(
      join(packageDir, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2),
    );
    await writeFile(
      join(packageDir, 'eslint.config.js'),
      `import {config} from "${scope}/eslint-config";\n\nexport default config();\n`,
    );
    await writeFile(
      join(packageDir, 'src', 'index.ts'),
      `export const ${safeName.replace(/-/g, '')} = "todo";\n`,
    );

    console.log(`\n✅ Created packages/${safeName}`);
    rl.close();
  } catch (err) {
    console.error('Error:', err);
    rl.close();
  }
}

async function cleanCodebase(hard: boolean) {
  const targets = ['dist', 'build', '.turbo', '.expo', 'tsconfig.tsbuildinfo'];
  if (hard) targets.push('node_modules', 'pnpm-lock.yaml');
  await recursiveDelete(process.cwd(), targets);
  console.log('\n✨ Clean complete!');
  rl.close();
}

async function recursiveDelete(dir: string, targetNames: string[]) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (targetNames.includes(entry.name)) {
        await rm(fullPath, { recursive: true, force: true });
        continue;
      }
      if (
        entry.isDirectory() &&
        entry.name !== '.git' &&
        entry.name !== 'node_modules'
      ) {
        await recursiveDelete(fullPath, targetNames);
      }
    }
  } catch (err) {}
}

async function showMenu() {
  console.log('\n🛠️  Monorepo Manager\n');
  console.log('1. 📦 Create a new package');
  console.log('2. 🧹 Clean Build Artifacts');
  console.log('3. 🧨 Hard Clean');
  console.log('4. 🧪 Run E2E Tests');
  console.log('0. ❌ Exit\n');

  const answer = await ask('Choose an option: ');

  switch (answer.trim()) {
    case '1':
      await createNewPackage();
      break;
    case '2':
      await cleanCodebase(false);
      break;
    case '3':
      await cleanCodebase(true);
      break;
    case '4':
      await runE2ETests();
      break;
    case '0':
      rl.close();
      process.exit(0);
      break;
    default:
      console.log('Invalid option.');
      rl.close();
      process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await showMenu();
    return;
  }

  const command = args[0];

  switch (command) {
    case 'e2e':
      await runE2ETests(args[1]);
      break;
    case 'create':
    case 'new':
    case 'package':
      await createNewPackage();
      break;
    case 'clean':
      await cleanCodebase(false);
      break;
    case 'clean:hard':
      await cleanCodebase(true);
      break;
    case 'help':
    case '--help':
    case '-h':
      console.log('\n🛠️  Monorepo Manager - CLI\n');
      console.log('Usage:');
      console.log('  pnpm manage                    - Show interactive menu');
      console.log('  pnpm manage e2e [test-name]    - Run e2e test');
      console.log('  pnpm manage create             - Create new package');
      console.log('  pnpm manage clean              - Clean build artifacts');
      console.log(
        '  pnpm manage clean:hard         - Hard clean (includes node_modules)',
      );
      console.log('\nExamples:');
      console.log('  pnpm manage e2e toggle         - Run toggle test');
      console.log('  pnpm manage e2e button         - Run button test');
      console.log(
        '  pnpm manage e2e                - Show test selection menu\n',
      );
      rl.close();
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run "pnpm manage help" for usage information.');
      rl.close();
      process.exit(1);
  }
}

main();
