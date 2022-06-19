const db = require('./conn')
const { randomStr } = require('../utils/crypto')

module.exports = () => {
  const col = db().collection('comment')
  return {
    // create a topic, return topic id, return '' for error
    async create(topicId, username, content, replyId, time) {
      const id = randomStr()
      try {
        await col.insertOne({
          _id: id,
          topic: topicId,
          username,
          content,
          reply: replyId,
          time: time
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
}