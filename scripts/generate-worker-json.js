const Fs = require('fs')
const Path = require('path')

const source = Fs.readFileSync(Path.join(process.cwd(),'./lib/worker/index.js')).toString()
const targetPath = Path.join(process.cwd(),'./lib/worker/index.json')
const content = {
    worker: source
}
Fs.writeFileSync(targetPath, JSON.stringify(content))


