const { db } = require('./index')
const { randomStr } = require('../utils/crypto')

const col = db.collection('comment')

module.exports = {
  // create a topic, return topic id, return '' for error
  async create(topicId, username, content, replyId) {
    const id = randomStr()
    try {
      await col.insertOne({
        _id: id,
        topic: topicId,
        username,
        content,
        reply: replyId,
        time: Date.now()
      })
      return id
    } catch {
      return ''
    }
  },
  // return a topic list
  async getList(topicId, begTime, count) {
    return await col.find({ topic: topicId, time: { $lt: begTime } })
                    .sort({ time: -1 })
                    .limit(count)
                    .toArray()
  }
}