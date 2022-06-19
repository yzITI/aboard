const mongodb = require('mongodb')

const { mongoDB } = require('../config')

const client = new mongodb.MongoClient(mongoDB.url, { useUnifiedTopology: true })

client.connect(err => {
  if (err) throw err
})

module.exports = () => client.db(mongoDB.db)