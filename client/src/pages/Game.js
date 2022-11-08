import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ControlPanel } from "../game_components/ControlPanel";
import { Hand } from "../game_components/Hand";
import { Pool } from "../game_components/Pool";
import { StatusThing } from "../game_components/StatusThing";
import { fetchPatch } from "../util";

export function Game({user}) {
  const [gameState, setGameState] = useState({game_phase:"", users:[], hand:[], black_card:{text:""}})
  const navigate = useNavigate()

  useEffect(() => {
    const leaveGame = e => fetchPatch("/leave")
    window.addEventListener("beforeunload", leaveGame);
    return () => { window.removeEventListener("beforeunload", leaveGame); }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { fetch("/game_state").then(r=>{
      if(r.ok) { r.json().then(d=>setGameState(d)) }
      else { r.json().then(e=>{ if(e.errors && e.errors[0] === "Not in a game") { navigate("/") } } )}
    })}, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const userIsCardCzar = user.id === gameState.card_czar_id
  const is_lobby_owner = user.id === gameState.lobby_owner_id

  return <div className="game">
    <StatusThing userIsCardCzar={userIsCardCzar} user_id={user.id} is_lobby_owner = {is_lobby_owner} gameState={gameState}/>
    {["pick", "result"].includes(gameState.game_phase) && <>
      <Hand game_phase={gameState.game_phase} userIsCardCzar={userIsCardCzar} gameState={gameState} enable_discards={gameState.enable_discards} user={user}/>
      <Pool gameState={gameState} userIsCardCzar={userIsCardCzar}/>
    </>}
    {/* separate from above to ensure card controls are never under pool */}
    {gameState.game_phase === "submit" && <>
      <Pool gameState={gameState} userIsCardCzar={userIsCardCzar}/>
      <Hand game_phase={gameState.game_phase} userIsCardCzar={userIsCardCzar} enable_discards={gameState.enable_discards} gameState={gameState} user={user}/>
    </>}

    <ControlPanel gameState={gameState} user={user} is_lobby_owner={is_lobby_owner} currentUser={user}/>
  </div>
}
