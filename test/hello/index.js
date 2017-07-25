

module.exports = {
  get: {
    '/': () => 'hello world',
    '/:name': (query) => `hello ${query.name}`
  }
}
