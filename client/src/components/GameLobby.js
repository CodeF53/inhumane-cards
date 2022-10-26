import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function GameLobby({ lobby: {id, host, password_protected, num_players, player_limit}}) {
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [errorText, setErrorText] = useState("")

  function joinGame() {
    fetch(`join/${id}`, { method: "PATCH" }).then(r=>{
      if (r.ok) { navigate("/game/")}
      else { r.json().then(d=>setErrorText(d.errors[0]))}
    })
  }

  // only show join button if lobby isn't full and password is inputted (if required)
  const showJoinButton = num_players < player_limit && (password_protected? password!=="" : true)

  return <div className="row centerChildren gameLobby">
    <span>{host}'s game</span>
    <span>{num_players}/{player_limit} players</span>

    {password_protected?<div className="col">
      <span>Password Protected</span>
      <input type="password" placeholder="password" ariaLabel={`password to join ${host}'s game`} value={password} onChange={(e)=>setPassword(e.target.value)}/>
    </div>:""}

    <div className="spacer"/>

    {showJoinButton?<button onClick={joinGame} aria-label={`join ${host}'s game`}>Join Game</button>:null}

    <span className="errors">{errorText}</span>
  </div>
}