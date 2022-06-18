const webSocket = require('ws')

const client = new webSocket('ws://127.0.0.1:8080/', {
    headers: {
        'userId': 'test_client'
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
    client.send('hello!')
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