import { Server } from 'socket.io'
import express from 'express'
import http from 'http'
import UserManager from './managers/userManager'

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
})

const userManager = new UserManager()

io.on('connection', (socket) => {
  console.log(`a user connected`)
  userManager.addUser('randomName', socket)
  socket.on('disconnect', () => {
    userManager.removeUser(socket.id)
  })
})

server.listen(4000, () => {
  console.log(`listening on port 4000`)
})
