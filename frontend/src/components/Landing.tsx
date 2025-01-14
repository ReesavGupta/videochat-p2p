import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Landing = () => {
  const [name, setName] = useState('')
  const navigate = useNavigate()
  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="submit"
        placeholder="Submit"
        onClick={() => {
          navigate(`/room/?name=${name}`)
        }}
      />
    </div>
  )
}
