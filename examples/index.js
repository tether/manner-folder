/**
 * Dependencie(s)
 */

const http = require('http')
const manner = require('manner')
const folder = require('..')

const api = manner(folder(__dirname + '/api'), process.env.NODE_ENV === 'development')

http.createServer((req, res) => {
  api(req, res).pipe(res)
}).listen(3001)
