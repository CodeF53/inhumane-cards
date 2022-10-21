import { Fragment, useState } from "react";

export function GameLobby({ lobby: {id, host, password_protected, num_players}}) {
  const [password, setPassword] = useState("")

  function joinGame() {
    
  }

  return <div className="row centerChildren gameLobby">
    <span>{host}'s game</span>
    <span>{num_players} players</span>

    {password_protected?<div className="col">
      password_protected
      <input type="password" placeholder="password" ariaLabel={`password to join ${host}'s game`} value={password} onChange={(e)=>setPassword(e.target.value)}/>
    </div>:""}

    <div className="spacer"/>
    <button onClick={joinGame} ariaLabel={`join ${host}'s game`}>Join Game</button>
  </div>
}