import { Fragment, useState } from "react"
import { fetchPatch } from "../util"

export function ControlPanel({ gameState: { users, card_czar_id, game_phase, game_stuff }, is_lobby_owner }) {
  const [mode, setMode] = useState("")


  var winning_user_id
  if (game_stuff) {
    // eslint-disable-next-line
    var { winning_user_id } = game_stuff
  }

  // TODO: hook up leave game button
  return <div className={`controlPanel ${is_lobby_owner?"lobbyOwner":""} col`}>
    <div className={`users col ${mode}`}>
      {users.map(user=><User user={user} card_czar_id={card_czar_id} winning_user_id={winning_user_id} key={user.id} is_lobby_owner={is_lobby_owner}/>)}
    </div>
    <div className="shit row">
      <div className="spacer"/>

      {is_lobby_owner && <Fragment>
        {mode===""? <Fragment>
          <button onClick={()=>setMode("kick")}>kick</button>
          <button onClick={()=>setMode("promote")}>promote</button>
        </Fragment>:
          <button onClick={()=>setMode("")}>cancel</button>}

        {is_lobby_owner && (game_phase==="lobby" || game_phase==="over")?
          <button onClick={()=>{fetchPatch("/start_game")}}>start game</button>:null
        }
      </Fragment>}


      <button onClick={e=>{fetchPatch("/leave")}}>leave game</button>

    </div>
    <div className="row">
      <div className="spacer"/>
      {mode!=="" && <h3>click a user to {mode}</h3>}
    </div>
  </div>
}

function User({ user, card_czar_id, winning_user_id, lobby_owner_id }) {
  const is_card_czar = user.id === card_czar_id
  const is_winning_user = user.id === winning_user_id
  const is_lobby_owner = user.id === lobby_owner_id

  // TODO: hook up kick button
  // TODO: hook up promote button
  // TODO: nice svgs for icon
  return <div className="user row">
    <div className="icon">
      {is_winning_user && "W"}
      {is_card_czar && "C"}
      {is_lobby_owner && "L"}
    </div>
    <span className="username">{user.username}</span>

    <div className="spacer"/>

    <span>{user.game_score} points</span>
  </div>
}