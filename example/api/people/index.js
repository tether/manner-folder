const fs = require('fs')

module.exports = {

  get(params, data) {
    return fs.createReadStream(__dirname + '/people.json')
  },
  post(params) {
    return params.name
  }

}
