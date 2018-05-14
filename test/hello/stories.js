
module.exports = {
  get: {
    '/': {
      success: {
        status: 200,
        data: {
          name: 'hello'
        },
        payload: {
          name: 'hello'
        }
      }
    },
    '/:name': {
      success: {
        status: 200,
        data: {
          name: 'john'
        },
        payload: {
          name: 'hello john'
        }
      }
    }
  }
}
