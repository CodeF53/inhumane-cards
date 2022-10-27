export function StatusThing({userIsCardCzar, user_id, is_lobby_owner, gameState}) {
  const game_phase = gameState.game_phase
  const userHasSubmitted = gameState.game_phase==="submit" && gameState.game_stuff && gameState.game_stuff.users_submitted.includes(user_id)
  const isUsersTurn = (userIsCardCzar && game_phase === "pick") || (!userIsCardCzar && game_phase === "submit")

  // TODO: fix this
  let winning_user_name = ""
  if ((gameState==="over" || gameState==="result") && gameState.winning_user_id) {
    winning_user_name = gameState.users.filter(user=>user.id === gameState.winning_user_id)
  }

  let line1 = ""
  let line2 = ""

  if (isUsersTurn) {
    switch (game_phase) {
      case "submit":
        if (userHasSubmitted) {
          line2 = "Waiting for others to submit"
        } else {
          line1 = "Your Turn"
          line2 = "Submit a card"
        }
        break;
      case "pick":
        line1 = "Your Turn"
        line2 = "Pick the best card combination"
        break;
      default: break;
    }
  } else {
    switch (game_phase) {
      case "submit":
        line2 = "Waiting for others to submit"
        break;
      case "pick":
        line2 = "Waiting for the card czar to pick a card"
        break;
      case "result":
        line2 = `${winning_user_name} won the round`
        break;
      case "lobby":
        if (is_lobby_owner) { line2 = "Start the game when everyone is ready" }
        else { line2 = "Waiting for the lobby owner to start the game" }
        break;
      case "over":
        line1 = `${winning_user_name} wins the round`
        if (is_lobby_owner) { line2 = "Start the game when everyone is ready" }
        else { line2 = "Waiting for the lobby owner to start the game" }
        break;
      default: break;
    }
  }

  return <div className="statusThing">
    <h1>{line1}</h1>
    <h2>{line2}</h2>
  </div>
}