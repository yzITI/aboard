const randomStr = (length) => {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = ''
    for (var i = 0; i < length; i++) 
        result += str[Math.floor(Math.random() * str.length)]
    return result
}

// verify user
exports.verify = async (req) => {
    console.log(req.headers)
    // some logic, return user object or falsy value(which stands for failure or error)
    return {
        id: req.headers.userId || randomStr(16),
        admin: false
    }
}