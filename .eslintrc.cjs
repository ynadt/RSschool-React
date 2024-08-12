module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.app.json', './tsconfig.node.json'],
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier', 'import', 'react-compiler', 'simple-import-sort'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'error',
    'import/no-unresolved': 'error',
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'react-compiler/react-compiler': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
    },
  },
  ignorePatterns: ['node_modules', 'dist', 'coverage', '*.json', '.eslintrc.cjs'],
};
