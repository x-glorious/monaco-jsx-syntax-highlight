const ExecShPromise = require('exec-sh').promise
const Minimist = require('minimist')

const Path = require('path')
const Fs = require('fs')

const argv = Minimist(process.argv.slice(2))
// version
const version = argv['v'].trim()

const run = async () => {
  // update package.json version
  const packageFilePath = Path.join(process.cwd(), './package.json')
  const packageObj = JSON.parse(Fs.readFileSync(packageFilePath).toString())
  packageObj.version = version.toString()
  Fs.writeFileSync(packageFilePath, JSON.stringify(packageObj, null, 2))

  await ExecShPromise('git checkout master')
  await ExecShPromise(`git checkout -b release/v${version}`)
  await ExecShPromise('git add .')
  await ExecShPromise(`git commit --m "chore: public v${version}"`)
  await ExecShPromise(`git push origin release/v${version}`)
  await ExecShPromise(`git tag v${version}`)
  await ExecShPromise(`git push origin v${version}`)
}

run()
