#!/usr/bin/env node
import { mkdir, readdir, rm, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log('\n🛠️  Monorepo Manager\n');
  console.log('1. 📦 Create a new package');
  console.log('2. 🧹 Clean Build Artifacts');
  console.log('3. 🧨 Hard Clean');
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
    case '0':
      process.exit(0);
      break;
    default:
      console.log('Invalid option.');
      process.exit(1);
  }
  rl.close();
}

async function createNewPackage() {
  const packageName = await ask('Enter package name: ');
  const includeSlot =
    (await ask('Include @base-ui-rn/slot? (y/n): ')).toLowerCase() === 'y';

  if (!packageName) return;

  const safeName = packageName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const scope = '@base-ui-rn';
  const fullPackageName = `${scope}/${safeName}`;
  const packageDir = join(process.cwd(), 'packages', safeName);

  try {
    await access(packageDir);
    console.error(`Error: packages/${safeName} already exists.`);
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
      dependencies: includeSlot ? { [`${scope}/slot`]: 'workspace:*' } : {},
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
  } catch (err) {
    console.error('Error:', err);
  }
}

async function cleanCodebase(hard: boolean) {
  const targets = ['dist', 'build', '.turbo', '.expo', 'tsconfig.tsbuildinfo'];
  if (hard) targets.push('node_modules', 'pnpm-lock.yaml');
  await recursiveDelete(process.cwd(), targets);
  console.log('\n✨ Clean complete!');
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

main();
