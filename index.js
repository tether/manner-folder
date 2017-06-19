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
    '/': manner(require(folder))
  }
  fs.readdirSync(folder).map(file => {
    const path = folder + '/' + file
    if (fs.statSync(path).isDirectory()) {
      var hook = {}
      try {
        hook = require(path + '/hook')
      } catch (e) {
        console.log('HOOK NOT DEFINED')
      }
      routes['/' + file] = manner(proxy(require(path), hook.before, hook.after))
    }
  })
  return routes
}
