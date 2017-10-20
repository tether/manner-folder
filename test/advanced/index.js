

module.exports = {
  get(query) {
    console.log('WHAAAAAT', query.name)
    return query.name
  }
}
