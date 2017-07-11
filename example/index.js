/**
 * Example dependencies.
 */

const http = require('http')
const services = require('..')


const api = services(__dirname + '/api')
// const api = services({
//   '/' : __dirname + '/api',
//   '/super': __dirname + '/doc'
// })

/**
 * Create web service.
 */

http.createServer((req, res) => {
  api(req, res).pipe(res)
}).listen(4000)
