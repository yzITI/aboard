const webSocket = require('ws')

const auth = require('./auth')
const comet = require('./comet')

const wss = new webSocket.WebSocketServer({ port: 8080 })

wss.on('connection', async (ws, req) => {
  let user = await auth.verify(req)
  if (!user) {
    socket.write('401 Unauthorized')
    socket.destroy()
    return
  }

  // set heartbeat
  ws.isAlive = true
  ws.on('pong', () => {
    ws.isAlive = true
  })

  comet.initClient(ws, user)
})

const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate()
    ws.isAlive = false
    ws.ping()
  })
}, 30 * 1000)

wss.on('close', () => clearInterval(heartbeatInterval))