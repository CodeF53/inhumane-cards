import { useEffect, useState } from "react"
import { GameLobby } from "../components/GameLobby"

export function Lobbies({user}) {
  const [lobbies, setLobbies] = useState([])
  useEffect(() => {
    fetch("games").then(r=>r.json()).then((data)=>{setLobbies(data)})
  }, [])

  return <div className="col">
    <div className="centered">
      {lobbies.map(lobby=><GameLobby lobby={lobby} key={lobby.id}/>)}
    </div>
  </div>
}