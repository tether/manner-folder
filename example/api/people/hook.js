

module.exports = {
  before: {
    post(params) {
      return {
        name: `${params.name} from Tether`
      }
    }
  },

  after: {
    post(name) {
      return `Hello ${name}`
    }
  }
}
