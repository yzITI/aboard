const crypto = require('./utils/crypto')

// verify user
exports.verify = async (req) => {
  // some logic, return user object or falsy value(which stands for failure or error)
  return {
    id: crypto.randomStr(16),
    admin: false,
    name: decodeURI(req.headers.name)
  }
}