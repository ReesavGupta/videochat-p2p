import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

const URL = `http://localhost:400`
export const Room = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get('name')
  const [socket, setSocket] = useState<null | Socket>(null)
  const [connected, setConnected] = useState(false)
  const [lobby, setLobby] = useState(true)
  useEffect(() => {
    // logic to init the room

    const socket = io(`http://localhost:4000`)

    setSocket(socket)
    socket.on('connetion', () => {
      setConnected(true)
    })

    socket.on('send-offer', ({ roomId }) => {
      alert('send offer please!')
      setLobby(false)
      socket.emit('offer', {
        sdp: '',
        roomId,
      })
    })

    socket.on('offer', ({ roomId }) => {
      alert('send answer please !!!')
      setLobby(false)
      socket.emit('answer', {
        sdp: '',
        roomId,
      })
    })

    socket.on('answer', ({ roomId }) => {
      setLobby(false)

      alert('connection done !!!')
    })

    socket.on('lobby', () => {
      setLobby(true)
    })
  }, [name])
  if (lobby) {
    return <div>waiting to connect you to someone ...</div>
  }
  return (
    <>
      <div>
        this is room and this is the query parameter
        {name}
      </div>
      <div>
        <video
          src=""
          width={800}
          height={500}
        ></video>
        <video
          src=""
          width={800}
          height={500}
        ></video>
      </div>
    </>
  )
}
