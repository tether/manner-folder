

module.exports = {
  get: {
    '/': {
      query: {
        name(value) {
          return 'hello ' + value
        }
      }
    }
  }
}
