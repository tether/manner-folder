
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

test('should expose programmatic api', assert => {
  assert.plan(4)
  const api = endpoint({
    '/foo': __dirname + '/foo',
    '/hello': __dirname + '/hello',
  })
  assert.equal(api.get('/foo'), 'hello bar')
  assert.equal(api.post('/foo'), 'post something')
  assert.equal(api.get('/hello'), 'hello world')
  assert.equal(api.get('/hello/something'), 'hello something')
})


// @note should apply the schema for methodd, not HTTP
test('should accept schema', assert => {
  assert.plan(1)
  const api = endpoint({
    '/advanced': __dirname + '/advanced'
  })

  server((req, res) => {
    req.url = '/advanced?name=bar'
    const input = api(req, res)
    input.pipe(concat(data => assert.equal(data, 'hello bar')))
    input.pipe(res)
  }, null, true)
})
