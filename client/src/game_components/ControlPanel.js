import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { fetchPatch, fetchPost } from "../util"

import { ReactComponent as AwardSvg } from '../assets/award.svg';
import { ReactComponent as HammerSvg } from '../assets/hammer.svg';
import { ReactComponent as CrownSvg } from '../assets/crown.svg';

export function ControlPanel({ gameState: { users, lobby_owner_id, card_czar_id, game_phase, game_stuff }, is_lobby_owner, currentUser, leaveRoom, connection, cable }) {
  const [isHidden, setIsHidden] = useState(false)
  const [mode, setMode] = useState("")
  const navigate = useNavigate()

  var winning_user_id
  if (game_stuff) {
    // eslint-disable-next-line
    var { winning_user_id } = game_stuff
  }

  function onUserClick(clicked_user_id) {
    if (mode === "") return

    if (currentUser.id === clicked_user_id) return

    fetchPost(`/${mode}/${clicked_user_id}`).then(r=>{
      if(r.ok) { setMode("") }})
  }

  function leaveGame() {
    cable.subscriptions.subscriptions.map(sub => sub.unsubscribe())
    fetchPatch("/leave");
    navigate("/");
  }

  return <div className={`controlPanel col ${is_lobby_owner?"lobbyOwner":""} ${isHidden?"hidden":""} row`}>
    <button className="hide_show_button" onClick={()=>setIsHidden(!isHidden)}>
      {isHidden?"<":">"}
    </button>

    <div className="col" style={{width: "100%"}}>
      <div className={`users col ${mode}`}>
        {users.sort((a,b)=>a.id>b.id).map(user=><User user={user} card_czar_id={card_czar_id} winning_user_id={winning_user_id} key={user.id} lobby_owner_id={lobby_owner_id} is_lobby_owner={is_lobby_owner} onUserClick={onUserClick} />)}
      </div>
      <div className="row">
        <div className="spacer"/>

        {is_lobby_owner && <>
          {mode===""? <>
            <button onClick={()=>setMode("kick")}>kick</button>
            <button onClick={()=>setMode("promote")}>promote</button>
          </>:
            <button onClick={()=>setMode("")}>cancel</button>}
          </>
        }

        <button onClick={leaveGame}>leave game</button>
      </div>
      <div className="row">
        <div className="spacer"/>
        {mode!=="" && <span>click a user to {mode}</span>}
      </div>
    </div>
    <span className={`centered ${connection}`}>{connection}</span>
  </div>
}

function User({ user, card_czar_id, winning_user_id, lobby_owner_id, onUserClick }) {
  const is_card_czar = user.id === card_czar_id
  const is_winning_user = user.id === winning_user_id
  const is_lobby_owner = user.id === lobby_owner_id

  return <div className="user row">
    <div className="icon">{
      is_winning_user? <AwardSvg/> :
      is_card_czar?    <HammerSvg/>:
      is_lobby_owner?  <CrownSvg/>: null
    }</div>
    <span className="username" onClick={e=>onUserClick(user.id)}>{user.username}</span>

    <div className="spacer"/>

    <span>{user.game_score} points</span>
  </div>
}