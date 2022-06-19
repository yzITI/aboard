const db = require('./conn')
const { randomStr } = require('../utils/crypto')

module.exports = () => {
  const col = db().collection('topic')
  return {
    // create a topic, return topic id, return '' for error
    async create(title, username, content, time) {
      const id = randomStr()
      try {
        await col.insertOne({
          _id: id,
          title,
          content,
          username,
          time
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
                      .project({ content: 0 })
                      .toArray()
    }
  }
}