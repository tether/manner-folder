/**
 * Dependencies.
 */

const fs = require('fs')
const join = require('path').join
const parse = require('url').parse
const manner = require('manner')
const status = require('response-status')
const find = require('path-find')


/**
 * Create HTTP methods middleware from folder structure.
 *
 * @param {String} folder
 * @return {Stream}
 * @api public
 */

module.exports = function (folder) {
  const tree = {}
  const routes = walk(folder)
  return (req, res) => {
    const pathname = parse(req.url).pathname
    const handler = routes[pathname] || find(pathname, routes)
    if (handler) return handler(req, res)
    return notfound(req, res)
  }
}


/**
 * Recursively walk a folder and create a tree
 * graph representation.
 *
 * @param {Object} routes
 * @param {Object} parent
 * @param {String} folder
 * @return {Object}
 * @api private
 */

function walk (folder, dir = '/') {
  let routes = {}
  fs.readdirSync(folder).map(file => {
    const path = folder + '/' + file
    if (fs.statSync(path).isDirectory()) {
      dir = dir + file
      routes[dir] = middleware(path)
      routes = Object.assign(routes, walk(path, dir + '/'))
    }
  })
  return routes
}


/**
 * Create request middleware.
 *
 * @param {String} path
 * @api private
 */

function middleware (path) {
  try {
    let api = require(path)
    return manner(api)
  } catch (e) {
    return notfound
  }
}


/**
 * Return NotFound status code.
 *
 * We return the request because a strema should always
 * be returned. However, because the response is ended before it
 * does not matter which stream we return.
 *
 *
 * @param {Stream} req
 * @param {Stream} res
 * @api private
 */

function notfound (req, res) {
  status(res, 404)
  return req
}
