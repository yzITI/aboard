const { WebSocketServer } = require('ws')

const aauth = require('./utils/aauth.js')
const comet = require('./comet')
const handler = {
  block: require('./controllers/block.js')
}

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', async ws => {
  let user = null
  ws.on('message', async raw => {
    try {
      const data = JSON.parse(raw)
      const ns = data.N.split('.')
      const A = data.A || []
      if (user) A.push(user)
      if (data.N === 'auth') { // auth
        user = { id: 'test', name: 'name' }
        comet.setSocks(user.id, ws)
        comet.send(user.id, { N: 'auth' })
      }
      if (!user) return
      let f = handler
      for (const n of ns) {
        if (!f[n]) return
        f = f[n]
      }
      f(...A)
    } catch { return }
  })
})
