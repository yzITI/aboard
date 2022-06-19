const webSocket = require('ws')

const client = new webSocket('ws://127.0.0.1:8080/', {
  headers: {
    'name': encodeURI('测试用户')
  }
})

const heartbeat = () => {
  clearTimeout(this.pingTimeout)
  this.pingTimeout = setTimeout(() => {
    this.terminate()
    console.log('disconnected from the server: heartbeat lost')
  }, 30 * 1000 + 1000)
}


client.on('open', () => {
  client.send(JSON.stringify({
    o: 'topic.get',
    i: '233',
    d: {
      topic: 'zK7ZBPSAIwHqUrOvCCWGSg'
    }
  }))
})

client.on('message', (data) => {
  console.log(data.toString())
})

// heartbeat
client.on('open', heartbeat)
client.on('ping', heartbeat)
client.on('close', () => {
  clearTimeout(this.pingTimeout)
})