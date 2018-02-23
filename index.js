/**
 * Dependencie(s)
 */

const fs = require('fs')
const {
  join,
  relative
} = require('path')

/**
 * Generate a manner tree (resources) from a folder structure.
 *
 * @api public
 */

module.exports = (path) => {
  let resources = {}
  walk(path, folder => {
    resources = merge(
      resources,
      resource(join('/',
        relative(path, folder)),
        read(folder)
      )
    )
  })
  return resources
}


/**
 * Merge srouce object with manner tree.
 *
 * @param {Object} src
 * @param {Object} tree
 * @return {Object}
 * @api private
 */

function merge (src, tree) {
  Object.keys(tree).map(method => {
    const services = tree[method]
    const node = src[method] = src[method] || {}
    Object.keys(services).map(path => {
      node[path] = services[path]
    })
  })
  return src
}


/**
 * Walk folder recursively.
 *
 * @param {String} path
 * @param {Function} cb
 * @param {String} relative
 * @api private
 */

function walk (path, cb) {
  fs.readdirSync(path).map(file => {
    const folder = join(path, file)
    if (fs.statSync(folder).isDirectory()) {
      cb(folder)
      walk(folder, cb)
    }
  })
}


/**
 * Read manner resource Synchronously.
 *
 * @param {String} folder
 * @api private
 */

function read (folder) {
  try {
    var resource = require(folder)
  } catch (e) {
    resource = {}
  }
  return resource
}


/**
 * Create manner resource from a set of services, schema and user stories.
 *
 * @param {String} pathn
 * @param {Object} services
 * @param {Object} schema
 * @param {Object} stories
 * @return {Object}
 * @api private
 */

function resource (path, services, schema = {}, stories = {}) {
  const result = {}
  Object.keys(services).map(method => {
    const res = result[method] = result[method] || {}
    const service = services[method]
    if (typeof service === 'object') {
      Object.keys(service).map(p => {
        const route = trim(join(path, p))
        res[route] = parse(service[p])
      })
    } else {
      res[path] = parse(service)
    }
  })
  return result
}


/**
 * Trim path.
 *
 * Remove empty characters and end backslash.
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

function trim (path) {
  path = path.trim()
  const length = path.length - 1
  if (length > 0 && path[length] === '/') {
    path = path.substring(0, length)
  }
  return path
}


/**
 * Parse function to return manner service.
 *
 * @param {Function} service
 * @param {Object} schema
 * @param {Object} stories
 * @return {Object}
 * @api private
 */

function parse (service, schema, stories) {
  return {
    service,
    options: {},
    data: {}
  }
}
