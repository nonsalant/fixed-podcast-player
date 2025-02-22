import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

export default {
    plugins: [
        postcssImport,
        // https://browsersl.ist/#q=%3E%3D+5%25+in+US
        postcssPresetEnv({ browsers: '>= 5% in US' }),
        cssnano,
    ],
    map: { inline: false } // Generate external source maps
};