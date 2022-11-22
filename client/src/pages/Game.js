import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ControlPanel } from "../game_components/ControlPanel";
import { Hand } from "../game_components/Hand";
import { Pool } from "../game_components/Pool";
import { StatusThing } from "../game_components/StatusThing";

export function Game({ user, cable }) {
  const { game_id } = useParams()
  const [room, setRoom] = useState()
  const [gameState, setGameState] = useState({game_phase:"", users:[], hand:[], black_card:{text:""}})
  const navigate = useNavigate()
  if (!user) navigate("/")

  const [connection, setConnection] = useState("disconnected")

  function handleDisconnect() {
    setConnection("disconnected");
    connectToServer()
  }
  function handleData(newGameState) {
    if (!(newGameState.users.map(u=>u.id).includes(user.id))) {
      cable.subscriptions.subscriptions = []
      navigate("/kicked")
    } else {
      setGameState(newGameState)
    }
  }

  function connectToServer() {
    // clear old subscriptions
    cable.subscriptions.subscriptions = []

    // subscribe to updates to the game state
    setRoom(cable.subscriptions.create({ channel: "GamesChannel", game_id: game_id }, {
      connected:    ()=>setConnection("connected"),
      disconnected: handleDisconnect,
      received: data => handleData(JSON.parse(data))
    }))

    // manually fetch to get the initial state
    fetch(`/games/${game_id}`).then(r=>r.json().then(handleData))
  }

  useEffect(connectToServer, [])

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

    <ControlPanel gameState={gameState} user={user} is_lobby_owner={is_lobby_owner} currentUser={user} connection={connection}/>
  </div>
}
