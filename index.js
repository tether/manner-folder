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
      resource(
        join('/', relative(path, folder)),
        read(folder) || {},
        schema(folder),
        stories(folder)
      )
    )
  })
  return resources
}


/**
 * Read schema if exist.
 *
 * @param {String} path
 * @return {Object} (empty if schema does not exist)
 * @api private
 */

function schema (path) {
  const js = read(join(path, 'schema.js'))
  const json = read(join(path, 'schema.json'))
  return js || json || {}
}


/**
 * Read user stories if exist.
 *
 * @param {String} path
 * @return {Object} (empty if user stories does not exist)
 * @api private
 */

function stories (path) {
  const js = read(join(path, 'stories.js'))
  const json = read(join(path, 'stories.json'))
  return js || json || {}
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
  var resource = null
  try {
    resource = require(folder)
  } catch (e) {}
  return resource
}


/**
 * Create manner resource from a set of services, schema and user stories.
 *
 * @param {String} pathn
 * @param {Object} services
 * @param {Object} conf (services schema)
 * @param {Object} cases (user stories)
 * @return {Object}
 * @api private
 */

function resource (path, services, conf = {}, cases = {}) {
  const result = {}
  Object.keys(services).map(method => {
    const res = result[method] = result[method] || {}
    const service = services[method]
    const schema = conf[method] || {}
    const stories = cases[method] || {}
    if (typeof service === 'object') {
      Object.keys(service).map(p => {
        const route = trim(join(path, p))
        res[route] = parse(service[p], schema[p], stories[p])
      })
    } else {
      res[path] = parse(service, schema['/'], stories['/'])
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
 * @param {Object} data schema
 * @param {Object} stories
 * @return {Object}
 * @api private
 */

function parse (service, data = {}, stories = {}) {
  return {
    service,
    options: {},
    ...data,
    stories
  }
}
