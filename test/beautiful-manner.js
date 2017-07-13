
/**
 * Test dependencies.
 */

const test = require('tape')
const endpoint = require('..')
const server = require('server-test')
const concat = require('concat-stream')


test('should create endpoint from folder path', assert => {
  assert.plan(1)
  const api = endpoint(__dirname + '/hello')
  assert.equal(typeof api, 'function')
})


test('should call endpoint method on request', assert => {
  assert.plan(1)
  const api = endpoint(__dirname + '/hello')
  server((req, res) => {
    api(req, res).pipe(concat(data => assert.equal(data, 'hello world')))
  })
})


test('should recursively create endpoints from folder', assert => {
  assert.plan(2)
  const api = endpoint(__dirname)
  server((req, res) => {
    req.url = '/foo'
    api(req, res).pipe(concat(data => assert.equal(data, 'hello bar')))
  })
  server((req, res) => {
    req.url = '/hello'
    api(req, res).pipe(concat(data => assert.equal(data, 'hello world')))
  })
})


test('should create custom alias from folder endpoints', assert => {
  assert.plan(2)
  const api = endpoint({
    '/world': __dirname + '/hello',
    '/bar': __dirname + '/foo'
  })
  server((req, res) => {
    req.url = '/bar'
    api(req, res).pipe(concat(data => assert.equal(data, 'hello bar')))
  })
  server((req, res) => {
    req.url = '/world'
    api(req, res).pipe(concat(data => assert.equal(data, 'hello world')))
  })
})


// test('should create endpoint from function', assert => {
//   assert.plan(1)
//   const api = endpoint({
//     '/': (req, res) => {
//       assert.ok('passed')
//     }
//   })
//   server((req, res) => {
//     api(req, res)
//   })
// })
