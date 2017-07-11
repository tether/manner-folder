const fs = require('fs')

module.exports = {

  get : {
    '/': (params, data) => {
      return fs.createReadStream(__dirname + '/people.json')
    },
    '/:name': (query) => {
      return 'hello ' + query.name
    }
  },
  post(params, data) {
    return JSON.stringify(data)
  }

}
