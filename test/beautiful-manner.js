
/**
 * Test dependencies.
 */

const test = require('tape')
const endpoint = require('..')


test('should create endpoint from folder path', assert => {
  assert.plan(1)
  const api = endpoint(__dirname + '/fixtures')
  assert.equal(typeof api, 'function')
})
