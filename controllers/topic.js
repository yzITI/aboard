const { setSub, pub } = require('../comet')
const models = require('../models')

exports['topic.list'] = async (user, data) => {
  setSub(user.id, '0')
  let begTime = data.begTime
  let count = data.count
  if (!begTime) begTime = Date.now() + 1000
  if (!count) count = 20
  if (count > 50) count = 50
  if (count <= 0) return []
  return await models.topic().getList(begTime, count)
}

exports['topic.create'] = async (user, data) => {
  if (!data.title || !data.content) throw '参数错误:需要title, content'
  let time = Date.now()
  let id = await models.topic().create(data.title, user.name, data.content, time)
  if (id) {
    pub(0, {
      _id: id,
      title: data.title,
      time,
      username: user.name
    })
    return id
  } else {
    throw '数据库错误'
  }
}

exports['topic.get'] = async (user, data) => {
  if (!data.topic) throw '参数错误:需要topic'
  let topic = await models.topic().get(data.topic)
  if (!topic) throw '帖子不存在'
  setSub(user.id, topic._id)
  return topic
}