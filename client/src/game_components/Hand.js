import { useEffect, useState } from "react"
import { cardRotation } from "../math"

export function Hand({cards, game_phase, userIsCardCzar}) {
  const [selectedCard, setSelectedCard_] = useState(-1)
  const [cardSubmitted, setCardSubmitted] = useState(false)

  useEffect(() => {
    if (game_phase==="submit") {
      setSelectedCard_(-1)
      setCardSubmitted(false)
    }
  }, [game_phase])


  function submitCard() {
    setCardSubmitted(true)
    fetch(`/submit_card/${selectedCard}`, { method: "PATCH" })
  }

  function setSelectedCard(i,e) {
    if (!cardSubmitted && game_phase === "submit" && !userIsCardCzar) {
      e.stopPropagation()
      setSelectedCard_(i)
    }
  }

  const letUserPick = selectedCard===-1 && !userIsCardCzar && game_phase === "submit"

  const cardControls = <div className="cardControls col centerChildren">
    <button className="confirm" onClick={submitCard}>Confirm</button>
    <button className="cancel"  onClick={e=>setSelectedCard(-1,e)}>Cancel</button>
  </div>

  return <div className={`hand row ${letUserPick?"letUserPick":"dontLetUserPick"} ${selectedCard!==-1?"cardSelected":""} ${cardSubmitted?"cardSubmitted":""} ${game_phase}Phase`}>
    <div className="spacer"/>
    {cards.map((card, i)=>
      <div style={{transform:cardRotation(card)}} className={`card handCard ${i===selectedCard?"selected":""}`} key={i} onClick={e=>setSelectedCard(i,e)}>
        {i===selectedCard?cardControls:null}{card}
      </div>)
    }
    <div className="spacer"/>
  </div>
}