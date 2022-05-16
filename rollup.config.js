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
            },
            {
                file: 'lib/worker/index.min.js',
                format: 'iife',
                // sourcemap: !production,
                name: 'badeMind',
                strict: false
            },
            {
                file: 'lib/worker/index.umd.js',
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