
const path = require('path');
const webpack = require('webpack');
const Copy = require('copy-webpack-plugin');

// vars
const isProd = (process.env.NODE_ENV === 'production');
const src = 'src/backend';
const output = 'build';
const filename = `[name]${isProd ? '-[hash:6]' : ''}`;
const filenameExt = filename + '.[ext]';

module.exports = {
    entry: {
        main: path.resolve(src, 'main.ts')
    },
    output: {
        path: path.resolve(__dirname, output),
        filename: filename + '.js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'inline-source-map',
    target: 'electron-main',
    plugins: [
        new Copy([{ from: path.resolve(src, 'package.json') }])
    ],
    node: {
        __dirname: false,
        __filename: false
    }
}