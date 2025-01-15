import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Room } from './Room'

export const Landing = () => {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const [joined, setJoined] = useState(false)

  const [localVideoTack, setLocalVideoTrack] =
    useState<null | MediaStreamTrack>(null)

  const [localAudioTrack, setLocalAudioTrack] =
    useState<null | MediaStreamTrack>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  async function getCam() {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    const videoTrack = stream.getVideoTracks()[0]
    const audioTrack = stream.getAudioTracks()[0]

    setLocalAudioTrack(audioTrack)
    setLocalVideoTrack(videoTrack)
    if (!videoRef || !videoRef.current) {
      return
    }
    videoRef.current.srcObject = new MediaStream([videoTrack])
  }

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCam()
    }
  }, [videoRef])

  if (!joined) {
    return (
      <div>
        <video
          autoPlay
          autoFocus
          src=""
          ref={videoRef}
        ></video>

        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={() => setJoined(true)}>Join</button>
      </div>
    )
  }

  return (
    <Room
      name={name}
      localVideoTrack={localVideoTack}
      localAudioTrack={localAudioTrack}
    />
  )
}
