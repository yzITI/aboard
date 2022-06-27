const { MongoClient } = require('mongodb')
const { db, dbName } = require('./config')
const client = new MongoClient(db)

client.connect(async err => {
  if (err) throw err
  const B = client.db(dbName).collection('block')
  // initialize model
  await B.createIndex({ parent: 1 })
  await B.replaceOne({ _id: '' }, {}, { upsert: true })
  console.log('# Mongodb Ready')
})

module.exports = (col) => {
  const collection = client.db(dbName).collection(col)
  return {
    raw: () => collection,
    async insert (doc) {
      try {
        const res = Array.isArray(doc) ? await collection.insertMany(doc) : await collection.insertOne(doc)
        return res.insertedId || res.insertedIds
      } catch { return 0 }
    },
    async del (filter) {
      const res = await collection.deleteMany(filter)
      return res.acknowledged && res // 1 for success
    },
    async find (filter, opt = {}) {
      return await collection.find(filter, opt).toArray()
    },
    async put (filter, replace, upsert = true) {
      const res = await collection.replaceOne(filter, replace, { upsert })
      return res.acknowledged && res
    },
    async update (filter, update, upsert = false) {
      const res = await collection.updateOne(filter, { $set: update }, { upsert })
      return res.acknowledged && res
    },
    count: (filter, opt = {}) => collection.countDocuments(filter, opt)
  }
}