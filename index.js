/**
 * Dependencies.
 */

const fs = require('fs')
const manner = require('manner')

/**
 * Create HTTP methods middleware from folder structure.
 *
 * @param {String} folder
 * @return {Stream}
 * @api public
 */

module.exports = function (folder) {
  const routes = structure(folder)
  return (request) => {

  }
}

/**
 * Give routes from folder structure
 *
 * @param {String} fodler path
 * @return {Object}
 * @api private
 */

function structure (folder, cb) {
  const routes = {}
  const files = fs.readdirSync(folder)
  files.map(file => {
    const path = folder + '/' + file
    if (fs.statSync(path).isDirectory()) {
      routes['/' + file] = manner(require(path))
    }
  })
}
