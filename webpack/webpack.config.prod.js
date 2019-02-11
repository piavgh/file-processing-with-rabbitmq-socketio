'use strict';
const webpack = require('webpack');
const path = require('path');
const env = process.env.NODE_ENV;
var childProcess = require('child_process');
const __versionString__ = childProcess.execSync('git rev-parse --short HEAD').toString().trim();
const HtmlWebpackPlugin = require('html-webpack-plugin');
/*
 * so process.cwd() is used instead to determine the correct base directory
 * Read more: https://nodejs.org/api/process.html#process_process_cwd
 */
const CURRENT_WORKING_DIR = process.cwd();

var config = {
    context: path.resolve(CURRENT_WORKING_DIR, 'client'),
    entry: {
        app: [
          'babel-polyfill',
          './main.js'
        ]
    },
    mode: 'production',
    output: {
        path: path.resolve(CURRENT_WORKING_DIR, 'client-build/js/dist'), //  destination
        filename: 'app.min.js',
        publicPath: '',
    },
    plugins: [
        new HtmlWebpackPlugin({
              template: path.resolve(CURRENT_WORKING_DIR, 'webpack/templates/index.html'),
              inject: false,
              version: __versionString__,
              filename: '../../index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, //check for all js files
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-function-bind', '@babel/plugin-proposal-class-properties'],
                },
            },
            {
              test: /\.css$/,
              use:['style-loader','css-loader']
            }
        ]
    },
    devtool: "source-map"
};

module.exports = config;
