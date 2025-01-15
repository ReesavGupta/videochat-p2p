import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useSubmit } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

const URL = `http://localhost:400`
export const Room = ({
  name,
  localVideoTrack,
  localAudioTrack,
}: {
  name: string
  localVideoTrack: MediaStreamTrack | null
  localAudioTrack: MediaStreamTrack | null
}) => {
  const [socket, setSocket] = useState<null | Socket>(null)
  const [connected, setConnected] = useState(false)
  const [lobby, setLobby] = useState(true)

  // state variables for setting the RTC peer Connection
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null)
  const [recieveingPc, setRecieveingPc] = useState<null | RTCPeerConnection>(
    null
  )

  // state variables for setting the audio and video tracks of your local system and the remote system
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<null | MediaStreamTrack>(null)

  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<null | MediaStreamTrack>(null)

  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null)

  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const locaVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // logic to init the room

    const connectedSocket = io(`http://localhost:4000`)

    setSocket(connectedSocket)
    socket?.on('connetion', () => {
      setConnected(true)
    })

    /*
      const pc = new RTCPeerConnection()
      undefined

      await pc.createOffer()

      {sdp: 'v=0\r\no=- 3725295011624879304 2 IN IP4 127.0.0.1\r\ns…0 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\n', type: 'offer'}
      
      sdp: "v=0\r\no=- 3725295011624879304 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\n"
      
      type: "offer"
    */

    socket?.on('send-offer', async ({ roomId }) => {
      alert('send offer please!')
      setLobby(false)

      const localRtcPeerConnection = new RTCPeerConnection()

      setSendingPc(localRtcPeerConnection)

      if (!localAudioTrack || !localVideoTrack) {
        return
      }

      localRtcPeerConnection.addTrack(localAudioTrack)
      localRtcPeerConnection.addTrack(localVideoTrack)

      localRtcPeerConnection.onicecandidate = async () => {
        const sdp = await sendingPc?.createOffer()
        socket.emit('offer', {
          sdp,
          roomId,
        })
      }
    })

    socket?.on('offer', async ({ roomId, offer }) => {
      alert('send answer please !!!')
      setLobby(false)

      const remoteRtcPeerConnection = new RTCPeerConnection()

      setRecieveingPc(remoteRtcPeerConnection)

      recieveingPc?.setRemoteDescription({ sdp: offer, type: 'offer' })
      const stream = new MediaStream()

      if (!remoteVideoRef || !remoteVideoRef.current?.srcObject) {
        return
      }
      remoteVideoRef.current.srcObject = stream
      setRemoteMediaStream(stream)

      if (!recieveingPc) {
        return
      }

      recieveingPc.ontrack = ({ track, type }) => {
        if (type == 'audio') {
          // setRemoteAudioTrack(track)
          //@ts-ignore
          remoteVideoRef.current.srcObject.addTrack = track
        } else {
          // setRemoteVideoTrack(track)
          //@ts-ignore
          remoteVideoRef.current.srcObject.addTrack = track
        }
        //@ts-ignore
        remoteVideoRef.current.play()
      }

      const sdp = await recieveingPc.createAnswer()

      socket?.emit('answer', {
        sdp,
        roomId,
      })
    })

    socket?.on('answer', ({ roomId, answer }) => {
      setLobby(false)

      setSendingPc((pc) => {
        pc?.setRemoteDescription({ sdp: answer, type: 'answer' })
        return pc
      })

      alert('connection done !!!')
    })

    socket?.on('lobby', () => {
      setLobby(true)
    })
  }, [name])

  useEffect(() => {
    if (!locaVideoRef || !locaVideoRef.current || !localVideoTrack) {
      return
    }
    locaVideoRef.current.srcObject = new MediaStream([localVideoTrack])
    locaVideoRef.current.play()
  }, [locaVideoRef])

  return (
    <>
      <div>
        this is room and this is the query parameter
        {name}
      </div>

      {lobby ? 'waiting to connect you to someone' : null}

      <div>
        <video
          autoPlay
          src=""
          width={400}
          height={300}
          ref={locaVideoRef}
        ></video>
        <video
          autoPlay
          src=""
          width={400}
          height={300}
          ref={remoteVideoRef}
        ></video>
      </div>
    </>
  )
}
