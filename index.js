/**
 * Dependencies.
 */

const fs = require('fs')


/**
 * Create HTTP methods middleware from folder structure.
 *
 * @param {String} folder
 * @param {HttpIncomingMessage} request
 * @return {Stream}
 * @api public
 */

module.exports = function (folder, request) {
  routes(folder)
}

/**
 * Give routes from folder structure
 *
 *
 * @return {Object}
 * @api private
 */

function routes (folder) {
  fs.readdir(__dirname + '/' + folder, (err, files) => {
    if (err) return
    console.log(files)
  })
}
