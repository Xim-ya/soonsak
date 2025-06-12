import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.json',
            },
            globals: {
                // Node.js globals
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',

                // Browser/Timer globals
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',

                // React Native globals
                global: 'readonly',
                __DEV__: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
                XMLHttpRequest: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            'react': react,
            'react-hooks': reactHooks,
        },
        rules: {
            // TypeScript 규칙들
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off', // React Native에서는 너무 엄격함
            '@typescript-eslint/explicit-function-return-type': 'off',

            // 강력한 타입 체크 규칙들 (일부 완화)
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/restrict-template-expressions': 'warn',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/strict-boolean-expressions': 'off', // React Native에서는 너무 엄격함

            // 기본 JavaScript 규칙들
            'no-undef': 'error',
            'no-unused-expressions': 'error',
            'no-unused-vars': 'off', // TypeScript 버전을 사용하므로 off

            // React 관련 규칙들
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react/jsx-uses-react': 'off', // React 17+에서는 불필요
            'react/react-in-jsx-scope': 'off', // React 17+에서는 불필요
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]; 