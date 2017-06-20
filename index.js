/**
 * Dependencies.
 */

const fs = require('fs')
const join = require('path').join
const parse = require('url').parse
const manner = require('manner')
const proxy = require('proxy-hook')
const schema = require('protocol-buffers-schema').parse

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
 * A service is a request handler plus optional hook
 * functions.
 *
 * @param {String} folder
 * @return {Function}
 * @api private
 */

function service (folder) {
  var hook = {}
  var before = {}
  try {
    hook = require(folder + '/hook')
    before = hook.before
  } catch (e) {}

  const validation = protocol(folder)
  Object.keys(validation)
    .map(key => {
      const method = before[key]
      const result = validation[key]
      before[key]= (params, data) => {
        return method
          ? method.apply(null, result)
          : validation[key]
      }
    })
  return manner(proxy(require(folder), before, hook.after))
}


/**
 *
 */

function protocol (folder) {
  const result = {}
  const name = folder.split('/').pop()
  try {
      const obj = schema(fs.readFileSync(`${folder}/${name}.schema`))
      obj.messages.map(message => {
        const fields = {}
        //console.log('message is', message.name.toLowerCase(), message)
        result[message.name.toLowerCase()] = (params, data) => {
          message.fields.map(field => {
            if (field.required && data[field.name] == null) throw new Error('missing!!')
          })
          return [params, data]
        }
      })
  } catch (e) {
  }
  return result
}
