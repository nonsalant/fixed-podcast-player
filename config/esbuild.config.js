import esbuild from 'esbuild';
import { stripTemplateLiteralWhitespace } from './esbuild-plugins.js';

const buildOptions = {
    entryPoints: ['scripts/component.js'],
    outfile: 'assets/build/script.min.js',
    plugins: [stripTemplateLiteralWhitespace()],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: 'esm',
    logLevel: 'info', // Set log level to capture warnings and errors
};

const args = process.argv.slice(2);
const watch = args.includes('--watch');

async function build() {
    try {
        const result = await esbuild.build(buildOptions);
        console.log('Build completed successfully.');
        if (result.warnings.length > 0) {
            console.warn('Warnings:', result.warnings);
        }
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

async function watchFiles() {
    try {
        const ctx = await esbuild.context(buildOptions);
        await ctx.watch();
        // console.log('Watching for changes...');
    } catch (error) {
        console.error('Watch failed:', error);
        process.exit(1);
    }
}

if (watch) {
    watchFiles();
} else {
    build();
}