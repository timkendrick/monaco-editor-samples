const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: {
		"app": './index.js',
		"editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
		"json.worker": 'monaco-editor/esm/vs/language/json/json.worker',
		"css.worker": 'monaco-editor/esm/vs/language/css/css.worker',
		"html.worker": 'monaco-editor/esm/vs/language/html/html.worker',
		"ts.worker": 'monaco-editor/esm/vs/language/typescript/ts.worker',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: require.resolve('monaco-editor/esm/vs/editor/common/services/editorSimpleWorker'),
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: [
								replaceSelfRequireWithGlobalRequire()
							]
						}
					}
				],
			}
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs\/language\/typescript\/lib/),
		new webpack.ContextReplacementPlugin(
			new RegExp('^' + path.dirname(require.resolve('monaco-editor/esm/vs/editor/common/services/editorSimpleWorker')) + '$'),
			'',
			{
				'vs/language/css/cssWorker': require.resolve('monaco-editor/esm/vs/language/css/cssWorker'),
				'vs/language/html/htmlWorker': require.resolve('monaco-editor/esm/vs/language/html/htmlWorker'),
				'vs/language/json/jsonWorker': require.resolve('monaco-editor/esm/vs/language/json/jsonWorker'),
				'vs/language/typescript/tsWorker': require.resolve('monaco-editor/esm/vs/language/typescript/tsWorker')
			}
		)
	],
};

function replaceSelfRequireWithGlobalRequire() {
	return (babel) => {
		const { types: t } = babel;
		return {
			visitor: {
				CallExpression(path) {
					const { node } = path;
					const isSelfRequireExpression = (
						t.isMemberExpression(node.callee)
						&& t.isIdentifier(node.callee.object, { name: 'self' })
						&& t.isIdentifier(node.callee.property, { name: 'require' })
					);
					if (!isSelfRequireExpression) { return; }
					path.get('callee').replaceWith(t.identifier('require'));
				}
			}
		};
	};
}
