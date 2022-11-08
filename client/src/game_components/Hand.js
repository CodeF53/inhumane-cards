import { useEffect, useState } from "react"
import { cardRotation, fetchPatch } from "../util"

export function Hand({game_phase, userIsCardCzar, gameState, user, enable_discards}) {
  const [cards, setCards] = useState([])
  const [selectedCard, setSelectedCard_] = useState(-1)
  const [discardedCard, setDiscardedCard] = useState(-1)
  const [cardSubmitted, setCardSubmitted] = useState(false)

  // fetch to ensure the card is submitted when it should be
  useEffect(() => {
    if (game_phase==="submit" && gameState.game_stuff.users_submitted.includes(user.id)) {
      setCardSubmitted(true)
    }
  },[game_phase, gameState, user])

  // update hand at the start of every submit round
  useEffect(() => {
    if (game_phase==="submit") {
      fetch("/hand").then(r=>r.json()).then(d=>{
        setCards(d)
        setSelectedCard_(-1)
        setDiscardedCard(-1)
        setCardSubmitted(false)
      })
    }
  }, [game_phase])


  function submitCard() {
    setCardSubmitted(true)
    fetchPatch(`/submit_card/${selectedCard}`)
  }

  function discardCard() {
    if (enable_discards) {
      setDiscardedCard(selectedCard)
      fetchPatch(`/discard_card/${selectedCard}`).then(r=>{setSelectedCard_(-1)})
    }
  }

  function setSelectedCard(i,e) {
    if (!cardSubmitted && game_phase === "submit" && !userIsCardCzar) {
      e.stopPropagation()
      setSelectedCard_(i)
    }
  }

  const letUserPick = !cardSubmitted && selectedCard===-1 && !userIsCardCzar && game_phase === "submit"

  const cardControls = <div className="cardControls col centerChildren">
    {enable_discards && discardedCard===-1? <button className="discard" onClick={discardCard}>Discard</button>:<button>&nbsp;</button>}
    <button className="confirm" onClick={submitCard}>Confirm</button>
    <button className="cancel"  onClick={e=>setSelectedCard(-1,e)}>Cancel</button>
  </div>

  return <div className={`hand row ${letUserPick?"letUserPick":"dontLetUserPick"} ${selectedCard!==-1?"cardSelected":""} ${cardSubmitted?"cardSubmitted":""} ${game_phase}Phase`}>
    <div className="spacer"/>
    {cards.map((card, i)=>
      <div style={{transform:cardRotation(card)}} className={`card handCard ${i===selectedCard?"selected":""} ${discardedCard===i?"discarded":""}`} key={i} onClick={e=>setSelectedCard(i,e)}>
        {i===selectedCard?cardControls:null}{card}
      </div>)
    }
    <div className="spacer"/>
  </div>
}