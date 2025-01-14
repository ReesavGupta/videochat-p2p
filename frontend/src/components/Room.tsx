import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export const Room = () => {
  const [searchParams, setSearchParams]=useSearchParams()
  const name = searchParams.get("name")

  useEffect(() => {
    // logic to init the room
  }, [name])

  return (
  <div>
    this is room and this is the query parameter
    {name}
  </div>
  )
}
