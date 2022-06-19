const controllers = Object.assign(
  require('./topic'),
  require('./comment')
)

module.exports = async (user, data) => {
  console.log(user, data)
  if (!data.i || !data.o || !data.d) return
  if (!controllers[data.o]) {
    return {
      e: 'unknown operation',
      i: data.i
    }
  } else {
    try {
      return {
        d: await controllers[data.o](user, data.d),
        i: data.i
      }
    } catch(err) {
      return {
        e: err,
        i: data.i
      }
    }
  }
}