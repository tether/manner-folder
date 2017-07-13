
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
