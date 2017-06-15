/**
 * Example dependencies.
 */

const http = require('http')
const services = require('..')


const api = services(__dirname + '/api')

/**
 * Create web service.
 */

http.createServer((req, res) => {
  api(req).pipe(res)
}).listen(4000)
