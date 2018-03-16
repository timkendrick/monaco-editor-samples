import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

monaco.editor.create(document.getElementById('container'), {
	value: [
		'from banana import *',
		'',
		'class Monkey:',
		'	# Bananas the monkey can eat.',
		'	capacity = 10',
		'	def eat(self, N):',
		'		\'\'\'Make the monkey eat N bananas!\'\'\'',
		'		capacity = capacity - N*banana.size',
		'',
		'	def feeding_frenzy(self):',
		'		eat(9.25)',
		'		return "Yum yum"',
	].join('\n'),
	language: 'python'
});
