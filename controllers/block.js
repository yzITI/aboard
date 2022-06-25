const crypto = require('../utils/crypto.js')
const comet = require('../comet.js')
const model = require('../model.js')
const B = model('block')

const wrap = (N, ...A) => ({ N, A })
const projection = { _id: 1, type: 1, time: 1, user: 1, author: 1, surface: 1 }

exports.get = async (_id, userId) => {
  if (!userId) return
  comet.setSub(userId, _id)
  // block info
  const block = await B.find({ _id }).then(r => r?.[0])
  if (!block) return comet.send(userId, wrap('block.error', _id))
  comet.send(userId, wrap('block.one', block))
  // children info
  const children = await B.find({ parent: _id }, { projection })
  const res = {}
  for (const c of children) {
    res[c._id] = c
    c.childrenCount = await B.count({ parent: c._id })
  }
  comet.send(userId, wrap('block.children', res))
}

exports.post = async (_id, block, userId) => {
  const b = await B.find({ _id }).then(r => r?.[0])
  if (!b) return comet.send(userId, wrap('block.error', _id))
  block._id = crypto.randomStr()
  block.time = Date.now()
  block.user = userId
  block.parent = _id
  await B.insert(block)
  comet.pub(_id, wrap('block.children', _id, { [block._id]: block }))
}

exports.del = async (_id, userId) => {
  const block = await B.find({ _id }).then(r => r?.[0])
  if (!block || block.user !== userId) return
  await B.del({ _id })
  comet.pub(_id, wrap('block.error', _id))
  let bids = [_id]
  while (bids.length) {
    const blocks = await B.find({ parent: { $in: bids } }, { projection: { _id: 1 } })
    await B.del({ parent: { $in: bids } })
    bids = blocks.map(x => x._id)
    for (const bid of bids) {
      comet.pub(bid, wrap('block.error', bid))
    }
  }
}
