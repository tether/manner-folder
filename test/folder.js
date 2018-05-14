
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

test('should generate a manner tree with schema', assert => {
  assert.plan(3)
  const resources = folder(__dirname)
  assert.deepEqual(resources.get['/advanced'].data, {
    name: {
      type: 'string'
    }
  })
  assert.deepEqual(resources.get['/foo'].data, {
    name: {
      type: 'string',
      default: 10
    }
  })
  assert.deepEqual(resources.post['/foo'].data, {
    name: {
      type: 'string',
      default: 20
    }
  })
})

test('should generate a manner tree with stories', assert => {
  assert.plan(3)
  const resources = folder(__dirname)
  assert.deepEqual(resources.get['/foo'].stories, {
    success: {
      data: {
        name: 'hello'
      },
      status: 200,
      payload: {
        name: 'hello'
      }
    }
  })
  assert.deepEqual(resources.get['/hello'].stories, {
    success: {
      status: 200,
      data: {
        name: 'hello'
      },
      payload: {
        name: 'hello'
      }
    }
  })
  assert.deepEqual(resources.get['/hello/:name'].stories, {
    success: {
      status: 200,
      data: {
        name: 'john'
      },
      payload: {
        name: 'hello john'
      }
    }
  })
})

test('should disable services', assert => {
  assert.plan(1)
  const resources = folder(__dirname, {
    disabled: true
  })
  const name = resources.get['/foo'].service
  assert.deepEqual(name(), 'service disabled')
})
