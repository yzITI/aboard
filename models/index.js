const mongodb = require('mongodb')

const { mongoDB } = require('../config')

const client = new mongodb.MongoClient(mongoDB.url, { useUnifiedTopology: true })
const db = client.db(mongoDB.db)

client.connect(err => {
    if (err) throw err
})

module.exports = {
    db,
    topic: require('./topic'),
    comment: require('./comment')
}