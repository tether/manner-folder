const fs = require('fs')

module.exports = {
  'get': (params) => {
    return fs.createReadStream(__dirname + '/people.json')
  },
  'post': () => {
    return 'hello ash'
  }
}
