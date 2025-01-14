import { User } from './userManager'

interface Room {
  user1: User
  user2: User
}
let GLOBAL_ROOM_ID = 1

export class RoomManager {
  private rooms: Map<string, Room>

  constructor() {
    this.rooms = new Map<string, Room>()
  }

  createRoom(user1: User, user2: User) {
    const roomId = this.generateRoomId().toString()

    this.rooms.set(roomId.toString(), { user1, user2 })

    user1.socket.emit('send-offer', {
      roomId,
    })
  }

  // deleteRoom(roomId:string){

  // }

  onOffer(roomId: string, sdp: string) {
    const user2 = this.rooms.get(roomId)?.user2
    user2?.socket.emit('offer', {
      sdp,
      roomId,
    })
  }

  onAnswer(roomId: string, sdp: string) {
    const user1 = this.rooms.get(roomId)?.user1
    console.log(`answer recieved`)
    user1?.socket.emit('answer', {
      sdp,
      roomId,
    })
  }

  generateRoomId() {
    return GLOBAL_ROOM_ID++
  }
}
