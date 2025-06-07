module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
    ],
    plugins: ['@typescript-eslint'],
    env: {
        es6: true,
        node: true,
        'react-native/react-native': true,
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        // 여기에 프로젝트에 필요한 추가 규칙들을 설정할 수 있습니다
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}; 