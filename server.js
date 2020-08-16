const express = require('express')
const app = express()

const https = require('https')
const fs = require('fs')
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/compsci.cl-0001/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/compsci.cl-0001/fullchain.pem')
}
const httpsServer = https.createServer(options, app)
httpsServer.listen(2304)

const expressWs = require('express-ws')(app, httpsServer)

let ultimoDato = 'no hay nada'

app.get('/', (req, res) => res.send('hola 2304'))

app.ws('/input', (ws, req) => {
  console.log('se conectó una raspberry')
  ws.on('message', msg => {
    if (msg === 'ack') {
      ws.send(ultimoDato)
    }
    else {
      console.log('me llegó', msg)
      ultimoDato = msg
      ws.send('ack')
    }
  })
})

