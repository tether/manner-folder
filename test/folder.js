
/**
 * Test dependencies.
 */

const test = require('tape')
const folder = require('..')


test('should generate a manner tree from a folder structure', assert => {
  assert.plan(17)
  const resources = folder(__dirname)
  assert.equal(typeof resources.get, 'object')
  assert.equal(typeof resources.post, 'object')

  assert.equal(typeof resources.get['/advanced'], 'object')
    const advanced = resources.get['/advanced'].service
    assert.equal(typeof advanced, 'function')
    assert.equal(advanced({name: 'john'}), 'john')


  assert.equal(typeof resources.get['/foo'], 'object')
    const foo = resources.get['/foo'].service
    assert.equal(typeof foo, 'function')
    assert.equal(foo(), 'hello bar')

  assert.equal(typeof resources.get['/hello'], 'object')
    const hello = resources.get['/hello'].service
    assert.equal(typeof hello, 'function')
    assert.equal(hello(), 'hello world')

  assert.equal(typeof resources.get['/hello/:name'], 'object')
    const name = resources.get['/hello/:name'].service
    assert.equal(typeof name, 'function')
    assert.equal(name({name: 'john'}), 'hello john')

  assert.equal(typeof resources.post['/foo'], 'object')
    const bar = resources.post['/foo'].service
    assert.equal(typeof bar, 'function')
    assert.equal(bar(), 'post something')
})
