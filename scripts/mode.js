const Minimist = require('minimist')
const Path = require('path')
const Fs = require('fs')
const TsConfigJson = require('./tsconfig.json')

// 解析参数
const argv = Minimist(process.argv.slice(2))
// mode
const mode = argv['mode']
// ts config target path
const tsConfig = Path.join(process.cwd(),'./tsconfig.json')
const requireTypescript = Path.join(process.cwd(),'./src/worker/typescript/index.ts')
let requireTypescriptScript = ''

if(mode === 'dev'){
    TsConfigJson.compilerOptions.module = 'commonjs'
    requireTypescriptScript = `export * from './dev'`
}else if(mode === 'build'){
    TsConfigJson.compilerOptions.module = 'ES2015'
    requireTypescriptScript = `export * from './build'`
}

Fs.writeFileSync(tsConfig, JSON.stringify(TsConfigJson, null, 2))
Fs.writeFileSync(requireTypescript, requireTypescriptScript)
