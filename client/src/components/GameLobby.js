import { useState } from "react";

export function GameLobby({ lobby: {id, host, password_protected, num_players, player_limit}}) {
  const [password, setPassword] = useState("")

  function joinGame() {
    
  }

  // only show join button if lobby isn't full and password is inputted (if required)
  const showJoinButton = num_players > player_limit && (password_protected? password!=="" : true)

  return <div className="row centerChildren gameLobby">
    <span>{host}'s game</span>
    <span>{num_players}/{player_limit} players</span>

    {password_protected?<div className="col">
      password_protected
      <input type="password" placeholder="password" ariaLabel={`password to join ${host}'s game`} value={password} onChange={(e)=>setPassword(e.target.value)}/>
    </div>:""}

    <div className="spacer"/>

    {showJoinButton?<button onClick={joinGame} ariaLabel={`join ${host}'s game`}>Join Game</button>:null}
  </div>
}