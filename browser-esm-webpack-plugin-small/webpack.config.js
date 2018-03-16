const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor/webpack');

module.exports = {
	mode: 'production',
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
		new MonacoWebpackPlugin(webpack, {
			languages: [
				'python'
			],
			features: [
				'coreCommands',
				'findController'
			]
		}),
		new UglifyJSPlugin()
	],
};
