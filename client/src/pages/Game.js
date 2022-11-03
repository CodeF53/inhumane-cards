import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ControlPanel } from "../game_components/ControlPanel";
import { Hand } from "../game_components/Hand";
import { Pool } from "../game_components/Pool";
import { StatusThing } from "../game_components/StatusThing";

export function Game({user}) {
  const [gameState, setGameState] = useState({game_phase:"", users:[], hand:[], black_card:{text:""}})
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => { fetch("/game_state").then(r=>{
      if(r.ok) { r.json().then(d=>setGameState(d)) }
      else { navigate("/") }
    })}, 1000);
    return () => clearInterval(interval);
  }, []);

  // console.log(gameState)
  const userIsCardCzar = user.id === gameState.card_czar_id
  const is_lobby_owner = user.id === gameState.lobby_owner_id

  return <div className="game">
    <StatusThing userIsCardCzar={userIsCardCzar} user_id={user.id} is_lobby_owner = {is_lobby_owner} gameState={gameState}/>
    {["submit", "pick", "result"].includes(gameState.game_phase)? <Fragment>
      <Pool gameState={gameState} userIsCardCzar={userIsCardCzar}/>
      <Hand game_phase={gameState.game_phase} userIsCardCzar={userIsCardCzar} gameState={gameState} user={user}/>
    </Fragment>:null}
    <ControlPanel gameState={gameState} user={user} is_lobby_owner={is_lobby_owner} currentUser={user}/>
  </div>
}
