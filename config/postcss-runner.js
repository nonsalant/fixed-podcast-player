import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.resolve(__dirname, '../styles/podcast-player.css');
const output = path.resolve(__dirname, '../assets/build/podcast-player.min.css');
const outputDir = path.dirname(output);
const configPath = path.resolve(__dirname, 'postcss.config.js');
const packageJsonDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const watch = args.includes('--watch');

async function loadConfig() {
    const config = await import(configPath);
    return config.default || config;
}

async function processCSS() {
    try {
        const css = fs.readFileSync(input, 'utf8');
        const config = await loadConfig();
        const result = await postcss(config.plugins).process(css, { from: input, to: output, map: config.map });

        // Ensure the output directory exists
        fs.mkdirSync(outputDir, { recursive: true });

        fs.writeFileSync(output, result.css);
        if (result.map) {
            fs.writeFileSync(`${output}.map`, result.map.toString());
        }
        console.log(`Processed ${path.relative(packageJsonDir, input)} to ${path.relative(packageJsonDir, output)}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

async function watchFiles() {
    await processCSS(); // Process CSS initially before watching

    const config = await loadConfig();
    const watcher = chokidar.watch(input);

    watcher.on('change', processCSS);

    // Watch imported files
    const css = fs.readFileSync(input, 'utf8');
    const result = await postcss(config.plugins).process(css, { from: input });
    result.messages.forEach(message => {
        if (message.type === 'dependency') {
            watcher.add(message.file);
        }
    });

    console.log(`Watching ${path.relative(packageJsonDir, input)} and its dependencies for changes...`);
}

if (watch) {
    watchFiles();
} else {
    processCSS();
}