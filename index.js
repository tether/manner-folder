/**
 * Dependencies.
 */

const fs = require('fs')
const join = require('path').join
const parse = require('url').parse
const manner = require('manner')
const status = require('response-status')
const find = require('path-find')
const debug = require('debug')('folder')


/**
 * Create HTTP methods middleware from folder structure.
 *
 * @param {String} folder
 * @return {Stream}
 * @api public
 */

module.exports = function (folder) {
  debug('Create endpoints from %s', folder)
  let routes = router(folder)
  const cb = (req, res) => {
    const pathname = normalize(parse(req.url).pathname)
    const handler = routes[pathname] || find(pathname, routes)
    debug(`Request endpoint %s ${!!handler ? 'suceeded': 'failed'}`, pathname)
    if (handler) return handler(req, res)
    return notfound(req, res)
  }
  return new Proxy(cb, {
    get(target, key, receiver) {
      return function (path, ...args) {
        let pathname = normalize(path)
        const handler = routes[pathname] || find(pathname, routes)
        const relative = handler.relative
        if (relative) {
          pathname = pathname.substring(relative.length)
        }
        return handler && handler.service[key](pathname, ...args)
      }
    }
  })
}


/**
 * Create routes from folder object or string.
 *
 * @param {String} folder
 * @param {String} relative
 * @param {Object} routes
 * @api private
 */

function router (folder, relative = '/', routes = {}) {
  if (typeof folder === 'object' ) {
    Object.keys(folder).map(key => {
      Object.assign(routes, router(folder[key], key, routes))
    })
  } else {
    const path = normalize(relative)
    if (typeof folder === 'function') {
      routes[path] = folder
    } else {
      routes[path] = middleware(folder, relative)
      Object.assign(routes, walk(folder, path))
    }
    debug('Add route %s', path)
  }
  return routes
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
      const normalized = normalize(route)
      routes[normalized] = middleware(path, route)
      debug('Add route %s', normalized)
      Object.assign(routes, walk(path, route + '/'))
    }
  })
  return routes
}


/**
 * Normalize path name.
 *
 * @param {String} pathname
 * @return {String}
 * @api private
 */

function normalize (pathname) {
  let suffix = pathname.substr(-1) !== '/' ? '/' : ''
  return pathname + suffix
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
    const service = manner(api, schema(path, relative))
    debug('Create route for %s from %s', relative, path)
    return Object.assign(service, {service, relative})
  } catch (e) {
    console.error(e)
    return notfound
  }
}


/**
 * Synchronously look for schema.
 *
 * @param {String} path
 * @param {String} relative
 * @api private
 */

function schema (path, relative) {
  let result = {}
  try {
    result = require(path + '/schema')
  } catch (e) {}
  result.relative = relative
  return result
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
