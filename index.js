const webSocket = require('ws')

const auth = require('./auth')
const comet = require('./comet')
const controller = require('./controllers')

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

  comet.setSocks(user.id, ws)
  
  ws.on('message', async (data) => {
    try {
      let res = await controller(user, JSON.parse(data))
      console.log(res)
      ws.send(JSON.stringify(res))
    } catch {
      return
    }
  })
})

const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate()
    ws.isAlive = false
    ws.ping()
  })
}, 30 * 1000)

wss.on('close', () => clearInterval(heartbeatInterval))