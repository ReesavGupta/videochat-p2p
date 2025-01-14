/*this is a user manager that tracks all the users
  @addUser to push the user to the this.users array
  @removeUser to remove the user from the this.users array


  ---->we need to manage the users who want to talk to each other via a queue such that the users don't end up talking to each other repeatedly. 
  ---->While creating a user we will add the user to the queue
  ---->suppose there are 30 people and we need to match people(2 at a time) whenver someome clicks next they go back to the queue
*/
import { Socket } from 'socket.io'
import { RoomManager } from './roomManager'

export interface User {
  name: string
  socket: Socket
}

export default class UserManager {
  private users: User[]
  private queue: string[]
  private roomManager: RoomManager
  constructor() {
    this.users = []
    this.queue = []
    this.roomManager = new RoomManager()
  }

  addUser(name: string, socket: Socket) {
    this.users.push({
      name,
      socket,
    })
    // whenever a user join we need to add them to the queue
    this.queue.push(socket.id)

    // we need to have a function that matches users they will be popped from the queue and get matched 2 at a time

    this.clearQueue()

    this.initHandlers(socket)
  }

  removeUser(socketId: string) {
    this.users = this.users.filter((x) => x.socket.id === socketId)
    this.queue = this.queue.filter((x) => x === socketId)
  }

  clearQueue() {
    if (this.queue.length < 2) return

    const user1 = this.users.find((x) => x.socket.id === this.queue.pop())
    const user2 = this.users.find((x) => x.socket.id === this.queue.pop())

    if (!user1 || !user2) {
      return
    }

    const room = this.roomManager.createRoom(user1, user1)
  }

  initHandlers(socket: Socket) {
    socket.on('offer', ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp)
    })
    socket.on('answer', ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onAnswer(roomId, sdp)
    })
  }
}
