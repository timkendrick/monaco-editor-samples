const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './index.js',
	output: {
		filename: 'app.bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolveLoader: {
		alias: {
			'blob-url-loader': require.resolve('./loaders/blobUrl'),
			'compile-loader': require.resolve('./loaders/compile'),
		},
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: [ 'style-loader', 'css-loader' ]
		}]
	},
	plugins: [
		new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs\/language\/typescript\/lib/),
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
		new UglifyJSPlugin()
	],
};
