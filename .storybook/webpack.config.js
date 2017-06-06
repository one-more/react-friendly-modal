// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/docs/react-storybook/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const path = require('path');
const root = path.resolve(__dirname, '..');

module.exports = {
    resolve: {
        modules: [path.join(root, 'src'), 'node_modules']
    },
    resolveLoader: {
        moduleExtensions: ["-loader"]
    },
    plugins: [
        // your custom plugins
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style!css!postcss!resolve-url'
            },
            {
                test: /\.(styl)$/,
                loader: 'style!css!postcss!resolve-url!stylus'
            },
        ],
    },
};