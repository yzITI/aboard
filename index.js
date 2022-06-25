const { WebSocketServer } = require('ws')

const comet = require('./comet')
const handler = {
  block: require('./controllers/block.js')
}

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', async ws => {
  let userId = ''
  ws.on('message', async raw => {
    try {
      const data = JSON.parse(raw)
      const ns = data.N.split('.')
      const A = data.A || []
      if (userId) A.push(userId)
      if (data.N === 'auth') { // auth
        userId = 'test'
        comet.setSocks(userId, ws)
        comet.send(userId, { N: 'auth' })
      }
      let f = handler
      for (const n of ns) {
        if (!f[n]) return
        f = f[n]
      }
      f(...A)
    } catch { return }
  })
})
