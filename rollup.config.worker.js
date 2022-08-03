import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'
import uglify from '@lopatnov/rollup-plugin-uglify'

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
      }),
      // 混淆压缩worker
      uglify()
    ]
  }
]
