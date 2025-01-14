import { Server } from 'socket.io'
import express from 'express'
import http from 'http'

const app = express()

const server = http.createServer(app)
const io = new Server(server)


io.on('connection', () =>{
  console.log(`a user connected`)
})

server.listen(4000, () => {
  console.log(`listening on port 4000`)
})
