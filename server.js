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
let grabando = false
let id = ''

app.get('/', (req, res) => res.send('hola 2304'))

app.ws('/input', (ws, req) => {
  console.log('se conectó una raspberry')
  ws.on('message', msg => {
    if (msg === 'ack') {
      ws.send(ultimoDato)
    }
    else if (msg === 'grabar') {
      grabando = true
    }
    else if (msg.startsWith('detener')) {
      grabando = false
      id = msg.split(',')[1]
    }
    else {
      ultimoDato = msg
      ws.send(`${grabando},${id}`)
    }
  })
  ws.on('error', console.err)
})

