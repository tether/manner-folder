
/**
 * Test dependencies.
 */

const test = require('tape')
const endpoint = require('..')
const server = require('server-test')
const concat = require('concat-stream')


test('should create endpoint from folder path', assert => {
  assert.plan(1)
  const api = endpoint(__dirname + '/fixtures')
  assert.equal(typeof api, 'function')
})


test('should call endpoint method on request', assert => {
  assert.plan(1)
  const api = endpoint(__dirname + '/fixtures')
  server((req, res) => {
    api(req, res).pipe(concat(data => assert.equal(data, 'hello world')))
  })
})
