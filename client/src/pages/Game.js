import { useEffect, useState } from "react";
import { ControlPanel } from "../game_components/ControlPanel";

// oh god writing this is going to be pain.
export function Game({user}) {
  const [gameState, setGameState] = useState({game_phase:"", users:[]})
  useEffect(() => {
    const interval = setInterval(() => { fetch("/game_state").then(r=>r.json()).then(d=>setGameState(d)) }, 500);
    return () => clearInterval(interval);
  }, []);

  console.log(gameState)

  let shit = null

  return <div className="game">
    {shit}
    <ControlPanel gameState={gameState} user={user}/>
  </div>
}