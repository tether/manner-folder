
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
    const input = api(req, res)
    input.pipe(concat(data => assert.equal(data, 'hello world')))
    input.pipe(res)
  }, null, true)
})


test('should recursively create endpoints from folder', assert => {
  assert.plan(2)
  const api = endpoint(__dirname)
  server((req, res) => {
    req.url = '/foo'
    const input = api(req, res)
    input.pipe(concat(data => assert.equal(data, 'hello bar')))
    input.pipe(res)
  }, null, true)
  server((req, res) => {
    req.url = '/hello'
    const input = api(req, res)
    input.pipe(concat(data => assert.equal(data, 'hello world')))
    input.pipe(res)
  }, null, true)
})


test('should create custom alias from folder endpoints', assert => {
  assert.plan(2)
  const api = endpoint({
    '/world': __dirname + '/hello',
    '/bar': __dirname + '/foo'
  })
  server((req, res) => {
    req.url = '/bar'
    const input = api(req, res)
    input.pipe(concat(data => assert.equal(data, 'hello bar')))
    input.pipe(res)
  }, null, true)
  server((req, res) => {
    req.url = '/world'
    const input = api(req, res)
    input.pipe(concat(data => assert.equal(data, 'hello world')))
    input.pipe(res)
  }, null, true)
})

test('should accept function as service', assert => {
  assert.plan(1)
  const api = endpoint({
    '/' : (req, res) => {
      assert.ok('endpoint called')
    }
  })
  server((req, res) => {
    api(req, res)
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
