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
    console.log(this.queue)
    socket.send('lobby')

    // we need to have a function that matches users they will be popped from the queue and get matched 2 at a time

    this.clearQueue()

    this.initHandlers(socket)
  }

  removeUser(socketId: string) {
    // const user = this.users.find((x) => x.socket.id === socketId)
    // if(!user)

    this.users = this.users.filter((x) => x.socket.id !== socketId)
    this.queue = this.queue.filter((x) => x === socketId)
  }

  clearQueue() {
    if (this.queue.length < 2) return
    const poppedUser1 = this.queue.pop()
    const poppedUser2 = this.queue.pop()

    // console.log(poppedUser1, poppedUser2)
    const user1 = this.users.find((x) => x.socket.id === poppedUser1)
    const user2 = this.users.find((x) => x.socket.id === poppedUser2)

    // console.log(user1, user2)

    if (!user1 || !user2) {
      return
    }
    // console.log(user1, user2)
    const room = this.roomManager.createRoom(user1, user2)
    this.clearQueue()
  }

  initHandlers(socket: Socket) {
    console.log('recieved offer')

    socket.on('offer', ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp)
    })
    socket.on('answer', ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      console.log('recieved answer')
      this.roomManager.onAnswer(roomId, sdp)
    })
  }
}
