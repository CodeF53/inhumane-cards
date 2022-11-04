import { useEffect, useState } from "react"
import { GameLobby } from "../components/GameLobby"

import { ReactComponent as RefreshSvg } from '../assets/refresh.svg';

export function Lobbies({user}) {
  const [forceRefreshListener, setForceRefresh] = useState(0)
  const forceRefresh = () => setForceRefresh(Math.random())

  const [lobbies, setLobbies] = useState([])
  useEffect(() => {
    fetch("games").then(r=>r.json()).then((data)=>{setLobbies(data)})
  }, [forceRefreshListener])

  // TODO: add refresh button
  return <div className="col">
    <div className="centered panel lobbies">
      <div className="row centerChildren">
        <h1>Lobbies</h1>
        <div className="spacer"/>
        <button className="refresh" onClick={forceRefresh}><RefreshSvg/></button>
      </div>
      {lobbies.length===0 && <h2>No Lobbies Found</h2>}
      {lobbies.map(lobby=><GameLobby lobby={lobby} key={lobby.id}/>)}
    </div>
  </div>
}