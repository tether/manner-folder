

module.exports = {
  get: {
    '/': {
      data: {
        name: {
          type: 'string',
          default: 10
        }
      }
    }
  },
  post: {
    '/': {
      data: {
        name: {
          type: 'string',
          default: 20
        }
      }
    }
  }
}
