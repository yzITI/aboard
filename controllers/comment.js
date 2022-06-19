const { pub } = require('../comet')
const models = require('../models')

exports['comment.list'] = async (user, data) => {
  if (!data.topic) throw '参数错误:需要topic'
  let begTime = data.begTime
  let count = data.count
  if (!begTime) begTime = Date.now() + 1000
  if (!count) count = 20
  if (count > 50) count = 50
  if (count <= 0) return []
  return await models.comment().getList(data.topic, begTime, count)
}

exports['comment.create'] = async (user, data) => {
  if (!data.topic || !data.content) throw '参数错误:需要topic, content'
  let time = Date.now()
  let reply = data.reply
  if (!reply) reply = ''
  let id = await models.comment().create(data.topic, user.name, data.content, reply, time)
  if (id) {
    pub(data.topic, {
      _id: id,
      topic: data.topic,
      content: data.content,
      time,
      username: user.name,
      reply
    })
    return id
  } else {
    throw '数据库错误'
  }
}