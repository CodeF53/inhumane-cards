import { useEffect, useState } from "react";
import Card from "./Card";

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
        <Card className="zoomIn" text="Cards Against Humanity" key={i} rotationSeed={i}/>)
      break
    case "pick":
      submittedCards = game_stuff.cards.map((card,i)=>
        <Card className="flipIn" text={card.text} onClick={e=>setSelectedCard(i,e)} isPool={true} controls={cardControls} selected={i===selectedCard} key={i} rotationSeed={i}/>)
      break
    case "result":
      submittedCards = game_stuff.cards.map((card,i)=>
        <Card className={`${card.id===game_stuff.winning_card_id?"winningCard":""}`} text={card.text} submitter={gameState.users.find(e=>e.id===game_stuff.card_user_ids[i]).username} key={i} rotationSeed={i}/>)
      break
    default:
      break
  }

  return <div className="pool col">
    <Card className="blackCard" text={blackCardText}/>
    <div className={`submitted row ${gameState.game_phase} ${selectedCard!==-1?"cardSelected":"cardNotSelected"}`}>
      <div className="spacer"/>
      {submittedCards}
      <div className="spacer"/>
    </div>
  </div>
}