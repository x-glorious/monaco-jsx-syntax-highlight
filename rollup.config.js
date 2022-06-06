import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default [
    {
        external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
        input: './src/worker/index.ts',
        output: [
            {
                file: 'lib/worker/index.js',
                format: 'cjs',
                strict: false
            },
            {
                file: 'lib/worker/index.module.js',
                format: 'es',
                strict: false
            }
        ],
        plugins: [
            typescript({
                useTsconfigDeclarationDir: true
            })
        ]
    },
    {
        external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
        input: './src/index.ts',
        output: [
            {
                file: 'lib/index.js',
                format: 'cjs',
                strict: false
            },
            {
                file: 'lib/index.module.js',
                format: 'es',
                strict: false
            },
            {
                file: 'lib/index.min.js',
                format: 'iife',
                // sourcemap: !production,
                name: 'monacoJsxSyntaxHighlight',
                strict: false
            },
            {
                file: 'lib/index.umd.js',
                format: 'umd',
                name: 'monacoJsxSyntaxHighlight',
                strict: false
            }
        ],
        plugins: [
            typescript({
                useTsconfigDeclarationDir: true
            })
        ]
    }
]