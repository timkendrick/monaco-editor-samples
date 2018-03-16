const path = require('path');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor/webpack');

module.exports = {
	mode: 'development',
	entry: './index.js',
	output: {
		filename: 'app.bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: [ 'style-loader', 'css-loader' ]
		}]
	},
	plugins: [
		new MonacoWebpackPlugin(webpack)
	],
};
