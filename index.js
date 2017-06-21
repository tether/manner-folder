/**
 * Dependencies.
 */

const fs = require('fs')
const join = require('path').join
const parse = require('url').parse
const manner = require('manner')
const proxy = require('proxy-hook')
const protocol = require('tether-schema')


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
    Object.keys(folder).map(item => {
      routes = Object.assign(routes, structure(folder[item], item))
    })
  } else {
    routes = structure(folder)
  }
  return (request, response) => {
    const pathname = parse(request.url).pathname
    const cb = routes[pathname]
    return cb(request, response)
  }
}

/**
 * Give routes from folder structure
 *
 * @param {String} fodler path
 * @return {Object}
 * @api private
 */

function structure (folder, dir = '/') {
  let routes = {}
  let root = join('/', dir)
  routes[root] = service(folder)
  fs.readdirSync(folder).map(file => {
    const path = folder + '/' + file
    if (fs.statSync(path).isDirectory()) {
      routes[join(root, file)] = service(path)
    }
  })
  return routes
}


/**
 * Create service.
 *
 * A service is a request handler with optional schema.
 *
 * @param {String} folder
 * @return {Function}
 * @api private
 */

function service (folder) {
  // handle case if does not exist, also create default webservice if index.js does not exist
  const api = require(folder)
  const name = folder.split('/').pop()
  const file = `${folder}/${name}.schema`

  if (fs.existsSync(file)) {
    const schema = protocol(fs.readFileSync(`${folder}/${name}.schema`))
    Object.keys(api).map(method => {
      const previous = api[method]
      api[method] = (params, data) => previous(params, schema(method, data))
    })
  }
  return manner(proxy(api))
}
