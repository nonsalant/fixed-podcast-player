import fs from 'fs';

/**
 * Custom ESBuild plugin to strip all whitespace from template literals in JavaScript files.
 */
export function stripTemplateLiteralWhitespace() {
    // fixes minify bug w/ comments inside inlined scripts
    // (eg: onclick = "...") inside of template literals
    return {
        name: 'strip-template-literals',
        setup(build) {
            build.onLoad({ filter: /\.js$/ }, async (args) => {
                const contents = await fs.promises.readFile(args.path, 'utf8');
                const modifiedContents = contents.replace(/`([^`]+)`/g, (match, p1) => {
                    return '`' + p1.replace(/\s+/g, ' ') + '`';
                });
                return { contents: modifiedContents, loader: 'js' };
            });
        },
    };
}
