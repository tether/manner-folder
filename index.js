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
  let routes = {}
  if (typeof folder === 'object') {
    Object.keys(folder).map(key => {
      router(routes, folder[key], key)
    })
  } else router(routes, folder, '/')
  return (req, res) => {
    const pathname = parse(req.url).pathname
    const handler = routes[pathname] || find(pathname, routes)
    if (handler) return handler(req, res)
    return notfound(req, res)
  }
}


/**
 * Create routes from folder.
 *
 * @param {Object} obj
 * @param {String} folder
 * @param {String} relative
 * @api private
 */

function router (obj, folder, relative) {
  obj[relative] = middleware(folder, relative)
  Object.assign(obj, walk(folder, relative))
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
      let route = dir + file
      routes[route] = middleware(path, route)
      Object.assign(routes, walk(path, route + '/'))
    }
  })
  return routes
}


/**
 * Create request middleware.
 *
 * @param {String} path
 * @param {String} relative
 * @api private
 */

function middleware (path, relative) {
  try {
    let api = require(path)
    return manner(api, relative)
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
