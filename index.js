/**
 * Dependencies.
 */

const fs = require('fs')
const parse = require('url').parse
const manner = require('manner')
const proxy = require('proxy-hook')

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
    '/': service(folder)
  }
  fs.readdirSync(folder).map(file => {
    const path = folder + '/' + file
    if (fs.statSync(path).isDirectory()) {
      routes['/' + file] = service(path)
    }
  })
  return routes
}


/**
 * Create service.
 *
 * A service is a request handler plus optional hook
 * functions.
 *
 * @param {String} folder
 * @return {Function}
 * @api private
 */

function service (folder) {
  var hook = {}
  try {
    hook = require(folder + '/hook')
  } catch (e) {}
  return manner(proxy(require(folder), hook.before, hook.after))
}
