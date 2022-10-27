import { useEffect, useState } from "react";
import { cardRotation } from "../util";

export function Pool({gameState, userIsCardCzar}) {
  const blackCardText = gameState.black_card.text
  const game_stuff = gameState.game_stuff

  const [selectedCard, setSelectedCard_] = useState(-1)

  function submitCard() {
    fetch(`/pick_card/${selectedCard}`, { method: "PATCH" })
  }

  function setSelectedCard(i,e) {
    if (gameState.game_phase === "pick" && userIsCardCzar) {
      e.stopPropagation()
      setSelectedCard_(i)
    }
  }

  useEffect(() => {
    if (gameState.game_phase!=="pick") {
      setSelectedCard_(-1)
    }
  }, [gameState])

  const letUserPick = userIsCardCzar && gameState.game_phase === "pick"

  const cardControls = letUserPick?<div className="cardControls col centerChildren">
    <button className="confirm" onClick={submitCard}>Confirm</button>
    <button className="cancel"  onClick={e=>setSelectedCard(-1,e)}>Cancel</button>
  </div>:null

  let submittedCards;
  switch (gameState.game_phase) {
    case "submit":
      submittedCards = [...Array(game_stuff.users_submitted.length)].map((a,i)=>
        <div style={{transform:cardRotation(`${i*5}`)}} className="card zoomIn">Cards Against Humanity</div>)
      break
    case "pick":
      submittedCards = game_stuff.cards.map((card,i)=>
        <div onClick={e=>setSelectedCard(i,e)} style={{transform:cardRotation(`${i*5}`)}} className="card flipIn">
          {card.text}
          {i===selectedCard?cardControls:null}
        </div>)
      break
    case "result":
      submittedCards = game_stuff.cards.map((card,i)=>
        <div style={{transform:cardRotation(`${i*5}`)}} className={`card ${card.id===game_stuff.winning_card_id?"winningCard":""}`}>
          <div className="submitter">{gameState.users.find(e=>e.id===game_stuff.card_user_ids[i]).username}</div>
          {card.text}
        </div>)
      break
    default:
      break
  }

  return <div className="pool col">
    <div style={{transform:cardRotation(blackCardText)}}  className="card blackCard">{blackCardText}</div>
    <div className="submitted row">
      <div className="spacer"/>
      {submittedCards}
      <div className="spacer"/>
    </div>
  </div>
}