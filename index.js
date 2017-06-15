/**
 * Dependencies.
 */

const fs = require('fs')
const parse = require('url').parse
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
    const pathname = parse(request.url).pathname
    const cb = routes[pathname]
    return cb(request)
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
  const routes = {
    '/': require(folder)
  }
  const files = fs.readdirSync(folder)
  files.map(file => {
    const path = folder + '/' + file
    if (fs.statSync(path).isDirectory()) {
      routes['/' + file] = manner(require(path))
    }
  })
  return routes
}
