import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GameLobby } from "../components/GameLobby"

export function Lobbies({user}) {
  const navigate = useNavigate()
  if (!user) navigate("/")

  const [lobbies, setLobbies] = useState([])
  useEffect(() => {
    fetch("games").then(r=>r.json()).then((data)=>{setLobbies(data)})
  }, [])

  console.log(lobbies)
  return <div className="col">
    <div className="centered">
      {lobbies.map(lobby=><GameLobby lobby={lobby}/>)}
    </div>
  </div>
}