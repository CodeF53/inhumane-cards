import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ControlPanel } from "../game_components/ControlPanel";
import { Hand } from "../game_components/Hand";
import { Pool } from "../game_components/Pool";
import { StatusThing } from "../game_components/StatusThing";
import Settings from "../game_components/Settings";

export function Game({ user, cable }) {
  const { game_id } = useParams()
  const [gameState, setGameState] = useState({game_phase:"", users:[], hand:[], black_card:{text:""}})
  const navigate = useNavigate()
  if (!user) navigate("/")

  useEffect(() => {
    const interval = setInterval(()=>{ try {
      cable.subscriptions.subscriptions[0].perform("ping", {})
    } catch {}}, 5000)
    return () => {
      clearInterval(interval)
      cable.subscriptions.subscriptions.map(sub => sub.unsubscribe())
    }
  }, [])

  const [connection, setConnection] = useState("disconnected")

  function connectToServer() {
    function handleConnect() {
      setConnection("connected")
      // ping server to let it know not to kick us
      setInterval(()=>{
        cable.subscriptions.subscriptions[0].perform("ping", {})
      }, 5000)
    }
    function handleDisconnect() {
      // attempt to reconnect cable
      setConnection("disconnected");
      connectToServer()
    }
    function handleData(newGameState) {
      // check to make sure the user is still actually in the server they are subscribed to
      if (!(newGameState.users.map(u=>u.id).includes(user.id))) {
        cable.subscriptions.subscriptions = []
        navigate("/kicked")
      } else {
        setGameState(newGameState)
      }
    }

    // clear old subscriptions
    cable.subscriptions.subscriptions = []

    // subscribe to updates to the game state
    cable.subscriptions.create({ channel: "GamesChannel", game_id: game_id }, {
      connected:    handleConnect,
      disconnected: handleDisconnect,
      received: data => handleData(JSON.parse(data))
    })

    // manually fetch to get the initial state
    fetch(`/games/${game_id}`).then(r=>r.json().then(handleData))
  }
  // connect to the server when we first join it
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

    <ControlPanel gameState={gameState} user={user} is_lobby_owner={is_lobby_owner} currentUser={user} connection={connection} cable={cable}/>

    <Settings/>
  </div>
}
