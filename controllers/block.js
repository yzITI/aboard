const crypto = require('../utils/crypto.js')
const comet = require('../comet.js')
const model = require('../model.js')
const B = model('block')

const wrap = (N, ...A) => ({ N, A })
const projection = { _id: 1, type: 1, time: 1, user: 1, author: 1, surface: 1 }

exports.get = async (_id, user) => {
  if (!user.id) return
  comet.setSub(user.id, _id)
  // block info
  const block = await B.find({ _id }).then(r => r?.[0])
  if (!block) return comet.send(user.id, wrap('block.error', _id))
  comet.send(user.id, wrap('block.one', block))
  // children info
  const children = await B.find({ parent: _id }, { projection })
  const res = {}
  for (const c of children) res[c._id] = c
  comet.send(user.id, wrap('block.children', _id, res))
}

exports.put = async (block, user) => {
  if (typeof block.parent === 'undefined') return
  const p = await B.find({ _id: block.parent }).then(r => r?.[0])
  if (!p) return comet.send(user.id, wrap('block.error', block.parent))
  if (block._id) { // update
    const b = await B.find({ _id: block._id }).then(r => r?.[0])
    if (!b || b.user !== user.id) return
  } else block._id = crypto.randomStr()
  block.time = Date.now()
  block.user = user.id
  block.author = user.name
  await B.put({ _id: block._id }, block)
  comet.pub(block._id, wrap('block.one', block))
  comet.pub(block.parent, wrap('block.children', block.parent, { [block._id]: block }))
}

exports.del = async (_id, user) => {
  const block = await B.find({ _id }).then(r => r?.[0])
  if (!block || block.user !== user.id) return
  await B.del({ _id })
  comet.pub(_id, wrap('block.error', _id))
  comet.pub(block.parent, wrap('block.removeChildren', block.parent, _id))
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
