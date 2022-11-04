import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPatchB } from "../util";

export function GameLobby({ lobby: {id, host, password_protected, num_players, player_limit}}) {
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [errorText, setErrorText] = useState("")

  function joinGame(e) {
    e.preventDefault()

    fetchPatchB(`join/${id}`, {password:password}).then(r=>{
      if (r.ok) { navigate("/game/")}
      else { r.json().then(d=>setErrorText(d.errors[0]))}
    })
  }

  // only show join button if lobby isn't full and password is inputted (if required)
  const gameFull = num_players >= player_limit

  return <form className="row centerChildren gameLobby" onSubmit={joinGame}>
    <span className="username">{host}'s game</span>
    <span>{num_players}/{player_limit} players</span>

    <div className="spacer"/>

    <input className={password_protected?"":"invisible"} type="password" placeholder="password" ariaLabel={`password to join ${host}'s game`}
      value={password} onChange={(e)=>{setPassword(e.target.value); setErrorText("")}}/>

    {gameFull?
      <span className="errors">Game Full</span>:

      <button aria-label={`join ${host}'s game`} type="submit">
        {errorText===""?
          "Join Game":
          <span className="errors">{errorText}</span>
        }
      </button>
    }

  </form>
}