import { Fragment, useEffect, useState } from "react";
import { ControlPanel } from "../game_components/ControlPanel";
import { Hand } from "../game_components/Hand";
import { Pool } from "../game_components/Pool";

// oh god writing this is going to be pain.
export function Game({user}) {
  const [gameState, setGameState] = useState({game_phase:"", users:[], hand:[], black_card:{text:""}})
  useEffect(() => {
    const interval = setInterval(() => { fetch("/game_state").then(r=>r.json()).then(d=>setGameState(d)) }, 500);
    return () => clearInterval(interval);
  }, []);


  console.log(gameState)
  const userIsCardCzar = user.id === gameState.card_czar_id

  return <div className="game">
    {["submit", "pick", "result"].includes(gameState.game_phase)? <Fragment>
      <Pool gameState={gameState} userIsCardCzar={userIsCardCzar}/>
      <Hand cards={gameState.hand} game_phase={gameState.game_phase} userIsCardCzar={userIsCardCzar} gameState={gameState} user={user}/>
    </Fragment>:null}
    <ControlPanel gameState={gameState} user={user}/>
  </div>
}