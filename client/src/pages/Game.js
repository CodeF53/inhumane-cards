import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ControlPanel } from "../game_components/ControlPanel";
import { Hand } from "../game_components/Hand";
import { Pool } from "../game_components/Pool";
import { StatusThing } from "../game_components/StatusThing";
import { fetchPatch } from "../util";

export function Game({ user, cable }) {
  const { game_id } = useParams()

  const [gameState, setGameState] = useState({game_phase:"", users:[], hand:[], black_card:{text:""}})
  const navigate = useNavigate()

  useEffect(() => {
    // manually fetch to get the initial state
    fetch(`/game/${game_id}`).then(r=>r.json().then(d=>{
      if (r.ok) { setGameState(d) }
      else if (d.errors && d.errors[0] === "you aren't in this game") { navigate("/") }
    }))

    // subscribe to updates to the game state
    cable.subscriptions.create({ channel: "GamesChannel", game_id: game_id }, {
      connected:    ()=>console.log("connected"),
      disconnected: ()=>console.log("connected"),
      received: newGameState=>setGameState(newGameState)
    })

    // leave game on closing tab
    const leaveGame = e => fetchPatch("/leave")
    window.addEventListener("beforeunload", leaveGame);
    return () => { window.removeEventListener("beforeunload", leaveGame); }
    // eslint-disable-next-line
  }, [cable, game_id]);

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
