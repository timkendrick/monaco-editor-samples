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
								createRequireContextPlugin({
									'vs/language/css/cssWorker': require.resolve('monaco-editor/esm/vs/language/css/cssWorker'),
									'vs/language/html/htmlWorker': require.resolve('monaco-editor/esm/vs/language/html/htmlWorker'),
									'vs/language/json/jsonWorker': require.resolve('monaco-editor/esm/vs/language/json/jsonWorker'),
									'vs/language/typescript/tsWorker': require.resolve('monaco-editor/esm/vs/language/typescript/tsWorker'),
								})
							]
						}
					}
				],
			}
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs\/language\/typescript\/lib/)
	],
};

function createRequireContextPlugin(paths) {
	return (babel) => {
		const { types: t } = babel;
		return {
			visitor: {
				CallExpression(path) {
					const { node } = path;
					const isAsyncRequireExpression = (
						t.isMemberExpression(node.callee)
						&& t.isIdentifier(node.callee.object, { name: 'self' })
						&& t.isIdentifier(node.callee.property, { name: 'require' })
						&& t.isArrayExpression(node.arguments[0])
						&& t.isFunction(node.arguments[1])
					);
					if (!isAsyncRequireExpression) { return; }
					const mockRequire = createMockAsyncRequire(babel, path.scope, paths);
					path.get('callee').replaceWith(mockRequire);
				}
			},
		};
	};
}

function createMockAsyncRequire(babel, scope, paths) {
	const { types: t } = babel;
	const providedPaths = scope.generateUidIdentifier('paths');
	const moduleIds = scope.generateUidIdentifier('moduleIds');
	const callback = scope.generateUidIdentifier('callback');
	const moduleId = scope.generateUidIdentifier('moduleId');
	const replacementPaths = t.objectExpression(
		Object.keys(paths).map((id) => t.objectProperty(
			t.stringLiteral(id),
			t.callExpression(t.identifier('require'), [t.stringLiteral(paths[id])])
		)),
	);
	const functionName = undefined;
	const paramNames = [ moduleIds, callback ];
	const functionBody = t.blockStatement([
		t.variableDeclaration('var', [t.variableDeclarator(providedPaths, replacementPaths)]),
		t.returnStatement(t.callExpression(
			t.memberExpression(callback, t.identifier('apply')),
			[
				t.identifier('undefined'),
				t.callExpression(
					t.memberExpression(moduleIds, t.identifier('map')),
					[
						t.functionExpression(undefined, [moduleId], t.blockStatement([
							t.ifStatement(
								t.unaryExpression('!', t.binaryExpression('in', moduleId, providedPaths)),
								t.throwStatement(t.newExpression(t.identifier('Error'), [
									t.binaryExpression('+', t.stringLiteral('Module not found: '), moduleId)
								]))
							),
							t.returnStatement(t.memberExpression(providedPaths, moduleId, true))
						]))
					]
				)
			]
		))
	]);
	return t.functionExpression(functionName, paramNames, functionBody);
}
