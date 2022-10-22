import { Fragment } from "react"

export function ControlPanel({ gameState: { users, card_czar_id, game_phase, lobby_owner_id, game_stuff }, user }) {
  var winning_user_id
  if (game_stuff) {
    var { winning_user_id } = game_stuff
  }

  const is_lobby_owner = user.id === lobby_owner_id

  // TODO: hook up leave game button
  return <div className={`controlPanel ${is_lobby_owner?"lobbyOwner":""} col`}>
    <div className="users col">
      {users.map(user=><User user={user} card_czar_id={card_czar_id} winning_user_id={winning_user_id} key={user.id} is_lobby_owner={is_lobby_owner}/>)}
    </div>
    <div className="shit row">
      <button>leave game</button>
      {is_lobby_owner && (game_phase==="lobby"||game_phase==="over")?
        <button onClick={()=>{fetch("/start_game", {method:"PATCH"})}}>start game</button>:null
      }
    </div>
  </div>
}

function User({ user, card_czar_id, winning_user_id, is_lobby_owner }) {
  const is_card_czar = user.id === card_czar_id
  const is_winning_user = user.id === winning_user_id

  // TODO: hook up kick button
  // TODO: hook up promote button
  // TODO: nice svgs for icon
  return <div className="user row">
    {is_lobby_owner?<button>kick</button>:null}
    {is_lobby_owner?<button>promote</button>:null}
    <span className="username">{user.username}</span>
    <div className="icon">
      {is_winning_user? "W":is_card_czar?"C":null}
    </div>

    <div className="spacer"/>

    <span>{user.game_score} points</span>
  </div>
}