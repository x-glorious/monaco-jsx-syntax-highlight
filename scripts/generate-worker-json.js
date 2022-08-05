const Fs = require('fs')
const Path = require('path')

let source = ''
try {
  source = Fs.readFileSync(Path.join(process.cwd(), './lib/worker/index.js')).toString()
} catch {
  console.log('create empty json')
}

const targetPath = Path.join(process.cwd(), './src/worker.json')
const content = {
  worker: source
}
Fs.writeFileSync(targetPath, JSON.stringify(content))
