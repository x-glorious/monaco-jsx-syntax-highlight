const ExecSh = require('exec-sh')
const Minimist = require('minimist')

const Path = require('path')
const Fs = require('fs')

const argv = Minimist(process.argv.slice(2))
// version
const version = argv['v'].trim()

// update package.json version
const packageFilePath = Path.join(process.cwd(), './package.json')
const packageObj = JSON.parse(Fs.readFileSync(packageFilePath).toString())
packageObj.version = version.toString()
Fs.writeFileSync(packageFilePath, JSON.stringify(packageObj, null, 2))

ExecSh('git checkout master')
ExecSh(`git checkout -b release/v${version}`)
ExecSh('git add .')
ExecSh(`git commit --m "chore: public v${version}"`)
ExecSh(`git push origin release/v${version}`)
ExecSh(`git tag v${version}`)
ExecSh(`git push origin v${version}`)
