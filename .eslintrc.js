module.exports = {
	root: true,
	extends: ['moon'],
	rules: {
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'sort-keys': 'off',
	},
	// TypeScript support
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
	},
	settings: {
		'import/resolver': {
			typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
		},
	},
};
