import { useEffect, useState } from "react"
import { GameLobby } from "../components/GameLobby"

export function Lobbies({user}) {
  const [lobbies, setLobbies] = useState([])
  useEffect(() => {
    fetch("games").then(r=>r.json()).then((data)=>{setLobbies(data)})
  }, [])

  // TODO: add refresh button
  return <div className="col">
    <div className="centered">
      <h1>Lobbies</h1>
      {lobbies.length===0 && <h2>No Lobbies Found</h2>}
      {lobbies.map(lobby=><GameLobby lobby={lobby} key={lobby.id}/>)}
    </div>
  </div>
}