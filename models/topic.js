const { db } = require('./index')
const { randomStr } = require('../utils/crypto')

const col = db.collection('topic')

module.exports = {
  // create a topic, return topic id, return '' for error
  async create(title, username, content) {
    const id = randomStr()
    try {
      await col.insertOne({
        _id: id,
        title,
        content,
        username,
        time: Date.now()
      })
      return id
    } catch {
      return ''
    }
  },
  async get(id) {
    return await col.findOne({ _id: id })
  },
  // return a topic list
  async getList(begTime, count) {
    return await col.find({ time: { $lt: begTime } })
                    .sort({ time: -1 })
                    .limit(count)
                    .project({ title: 1, content: 0, time: 1, username: 1 })
                    .toArray()
  }
}