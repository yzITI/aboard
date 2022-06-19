let sockets = {}

exports.initClient = (ws, user) => {
  sockets[user.id] = ws
  ws.on('message', (data) => {
    console.log(`${user.id}: ${data}`)
    ws.send(`received ${data}`)
  })
  ws.on('close', () => {
    console.log(`user ${user.id} disconnected`)
  })
}