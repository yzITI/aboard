const crypto = require('crypto')

exports.randomStr = (l = 16) => crypto.randomBytes(l).toString('base64url')