

module.exports = {
  get: {
    '/': {
      params: {
        name(value) {
          return 'hello ' + value
        }
      }
    }
  }
}
