

module.exports = {
  before: {
    post(params) {
      return {
        name: `${params} from Tether`
      }
    }
  },

  after: {
    post(params) {
      return `Hello ${params.name}`
    }
  }
}
