const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
	mode: 'production',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: [ 'style-loader', 'css-loader' ]
		}]
	},
	plugins: [
		new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs\/language\/typescript\/lib/),
		new UglifyJSPlugin()
	]
};

module.exports = [
	Object.assign({}, config, {
		name: 'app',
		target: 'web',
		entry: './index.js',
		output: Object.assign({}, config.output, {
			filename: 'app.bundle.js'
		})
	}),
	Object.assign({}, config, {
		name: 'worker',
		target: 'webworker',
		entry: {
			'app': './index.js',
			'editor': 'monaco-editor/esm/vs/editor/editor.worker.js',
			// 'json': 'monaco-editor/esm/vs/language/json/json.worker.js',
			// 'css': 'monaco-editor/esm/vs/language/css/css.worker.js',
			// 'html': 'monaco-editor/esm/vs/language/html/html.worker.js',
			// 'ts': 'monaco-editor/esm/vs/language/typescript/ts.worker.js'
		},
		output: Object.assign({}, config.output, {
			filename: '[name].worker.bundle.js'
		})
	})
];
