let sockets = {}
let subscriber = {} // subscriber[target][userId] = ws
let channel = {} // channel[userId] = target

module.exports = {
  setSocks(userId, ws) {
    sockets[userId] = ws
    ws.on('close', () => {
      delete sockets[userId]
      this.clearSub(userId)
    })
  },
  setSub(userId, target) {
    let oldChan = channel[userId]
    if (oldChan) {
      delete subscriber[oldChan][userId]
      if (Object.keys(subscriber[oldChan]).length === 0) {
        delete subscriber[oldChan]
      }
    }
    channel[userId] = target
    if (!subscriber[target]) subscriber[target] = {}
    subscriber[target][userId] = sockets[userId]
  },
  clearSub(userId) {
    let chan = channel[userId]
    if (!chan) return
    delete channel[userId]
    delete subscriber[chan][userId]
    if (Object.keys(subscriber[chan]).length === 0) {
      delete subscriber[chan]
    }
  },
  pub(target, data) {
    if (!subscriber[target]) return
    for (let i of Object.keys(subscriber[target])) {
      subscriber[target][i].send(JSON.stringify(data))
    }
  }
}