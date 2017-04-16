
const path = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const Html = require('html-webpack-plugin');

// vars
const isProd = (process.env.NODE_ENV === 'production');
const src = 'src';
const output = 'build';
const filename = `[name]${isProd ? '-[hash:6]' : ''}`;
const filenameExt = filename + '.[ext]';

// plugins
const plugins = [
    new Clean([path.resolve(output, '*')]),
    new Html({ filename: 'index.html', chunks: ['frontend'] }),
    new ExtractText(filename + '.css')
];

module.exports = {
    entry: {
        frontend: path.resolve(src, 'frontend', 'index.tsx')
        //backend: path.resolve(src, 'main.js')
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
            },
            {
                test: /\.s?css$/,
                use: ExtractText.extract(['css-loader', 'sass-loader'])
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: { name: filenameExt, limit: 1 } // Convert images < limit (byte) to base64 strings
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader',
                options: { name: filenameExt }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: { exportAsEs6Default: true }
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'inline-source-map',
    plugins: plugins,
    target: 'electron-renderer'
}