#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log('📁 LLM Context Generator\n');

    // Get configuration from user
    const startDir = await question('Enter directory to scan (default: current directory): ') || '.';
    const includePattern = await question('Include pattern (e.g., *.js,*.ts,*.md or * for all): ') || '*';
    const excludePattern = await question('Exclude pattern (e.g., *.log,*.tmp or leave empty): ') || '';
    const outputFile = await question('Output file (default: llm-context.txt): ') || 'llm-context.txt';
    const maxSize = parseInt(await question('Max file size in KB (default: 1000): ') || '1000', 10) * 1024;

    console.log('\n🔍 Scanning...\n');

    // Parse patterns
    const includePatterns = includePattern.split(',').map(p => p.trim()).filter(Boolean);
    const excludePatterns = excludePattern.split(',').map(p => p.trim()).filter(Boolean);

    // Default excludes (node_modules, .git, etc.)
    const defaultExcludes = ['node_modules', '.git', '.svn', '.hg', 'dist', 'build', '.next', '.nuxt', 'coverage', '.cache'];
    
    let output = [];
    let fileCount = 0;
    let totalSize = 0;

    function matchesPattern(filePath, patterns) {
        const filename = path.basename(filePath);
        const ext = path.extname(filePath);
        
        for (const pattern of patterns) {
            // Exact match
            if (pattern === filename) return true;
            // Extension match (*.js)
            if (pattern.startsWith('*.') && ext === pattern.slice(1)) return true;
            // Wildcard match (*)
            if (pattern === '*') return true;
            // Directory match (ends with /)
            if (pattern.endsWith('/') && filePath.includes(pattern.slice(0, -1))) return true;
            // Contains match
            if (filename.includes(pattern)) return true;
            // Glob-like: **/pattern
            if (pattern.includes('**')) {
                const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
                if (regex.test(filePath)) return true;
            }
        }
        return false;
    }

    function shouldInclude(filePath) {
        // Check default excludes first
        for (const exclude of defaultExcludes) {
            if (filePath.includes(exclude)) return false;
        }

        // Check user excludes
        if (excludePatterns.length > 0 && matchesPattern(filePath, excludePatterns)) {
            return false;
        }

        // Check includes
        if (includePatterns.length === 0 || includePatterns.includes('*')) {
            return true;
        }

        return matchesPattern(filePath, includePatterns);
    }

    function isBinary(filePath) {
        const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.pdf', '.zip', '.tar', '.gz', '.exe', '.dll', '.so', '.dylib', '.woff', '.woff2', '.ttf', '.eot', '.mp3', '.mp4', '.avi', '.mov', '.webm', '.wasm'];
        return binaryExts.some(ext => filePath.toLowerCase().endsWith(ext));
    }

    function scanDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(startDir, fullPath);

            if (entry.isDirectory()) {
                // Skip if matches default excludes
                if (defaultExcludes.some(ex => entry.name === ex || fullPath.includes(ex))) {
                    continue;
                }
                // Skip if matches user exclude patterns
                if (excludePatterns.length > 0 && matchesPattern(relativePath + '/', excludePatterns)) {
                    continue;
                }
                scanDirectory(fullPath);
            } else if (entry.isFile()) {
                if (!shouldInclude(fullPath)) continue;
                if (isBinary(fullPath)) continue;

                try {
                    const stats = fs.statSync(fullPath);
                    if (stats.size > maxSize) {
                        console.log(`⚠️  Skipping (too large): ${relativePath}`);
                        continue;
                    }

                    const content = fs.readFileSync(fullPath, 'utf-8');
                    
                    output.push(`FILE: ${relativePath}`);
                    output.push('```');
                    output.push(content);
                    output.push('```');
                    output.push(''); // Empty line between files

                    fileCount++;
                    totalSize += stats.size;
                    console.log(`✅ Added: ${relativePath}`);
                } catch (err) {
                    console.log(`❌ Error reading ${relativePath}: ${err.message}`);
                }
            }
        }
    }

    const absoluteStart = path.resolve(startDir);
    
    if (!fs.existsSync(absoluteStart)) {
        console.error(`❌ Directory not found: ${absoluteStart}`);
        process.exit(1);
    }

    scanDirectory(absoluteStart);

    // Write output
    const finalOutput = output.join('\n');
    fs.writeFileSync(outputFile, finalOutput, 'utf-8');

    console.log(`\n📊 Summary:`);
    console.log(`   Files included: ${fileCount}`);
    console.log(`   Total size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.log(`   Output: ${path.resolve(outputFile)}`);

    rl.close();
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});