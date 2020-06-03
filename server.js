const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)

let ultimoDato = 'no hay nada'

app.ws('/input', (ws, req) => {
  console.log('se conectó una raspberry')
  ws.on('message', msg => {
    if (msg === 'ack') {
      ws.send(ultimoDato)
    }
    else {
      ultimoDato = msg
      ws.send('ack')
    }
  })
})

app.listen(2304)
