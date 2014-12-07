/**
 * This script must be called like this:
 * node childProcessScript.js <PARENT_PID> <COMMAND> <COMMAND_ARGUMENTS...>
 *
 * You can terminate this script by sending a SIGINT signal to it.
 * It will also terminate automatically when the process with the given
 * parent PID no longer runs.
 */


/**
 * This is the same mechanism that Meteor currently use for parent alive checking.
 * @see webapp package.
 */
var startCheckForLiveParent = function (parentPid) {
  setInterval(function () {
    try {
      process.kill(parentPid, 0)
    } catch (err) {
      console.log("Parent process is dead! Exiting.")
      childProcess.kill('SIGINT')
      process.exit(1)
    }
  }, 3000)
}

var parentPid = process.argv[2]
var command = process.argv[3]
var commandArguments = process.argv.slice(4)

console.log('Spawn script arguments:')
console.log('parentPid:', parentPid)
console.log('command:', command)
console.log('commandArguments:', commandArguments)

var spawn = require('child_process').spawn
var childProcess = spawn(command, commandArguments, {
  cwd: process.cwd,
  env: process.env,
  stdio: 'inherit'
})

startCheckForLiveParent(parentPid)

process.on('SIGINT', function () {
  console.log('Received SIGINT. Exiting spawn script.')
  childProcess.kill('SIGINT')
  process.exit(1)
})
