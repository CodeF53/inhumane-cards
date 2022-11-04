import { fetchPatch } from "../util"

export function StatusThing({userIsCardCzar, user_id, is_lobby_owner, gameState}) {
  const game_phase = gameState.game_phase
  const userHasSubmitted = gameState.game_phase==="submit" && gameState.game_stuff && gameState.game_stuff.users_submitted.includes(user_id)
  const isUsersTurn = (userIsCardCzar && game_phase === "pick") || (!userIsCardCzar && game_phase === "submit")

  let winning_user_name = ""
  if ((game_phase==="over" || game_phase==="result") && gameState.game_stuff && gameState.game_stuff.winning_user_id) {
    winning_user_name = gameState.users.filter(user=>user.id === gameState.game_stuff.winning_user_id)[0].username
    console.log(winning_user_name);
  }

  let line1 = ""
  let line2 = ""
  let line2_is_start_button = false

  if (isUsersTurn) {
    switch (game_phase) {
      case "submit":
        if (userHasSubmitted) {
          line2 = "Waiting on other players"
        } else {
          line1 = "Your Turn"
          line2 = "Submit a card"
        }
        break;
      case "pick":
        line1 = "Your Turn"
        line2 = "Pick the best answer"
        break;
      default: break;
    }
  } else {
    switch (game_phase) {
      case "submit":
        line1 = "You are the Czar"
        line2 = "Waiting on other players"
        break;
      case "pick":
        line2 = "Waiting on the Czar"
        break;
      case "result":
        line2 = `${winning_user_name} won the round`
        break;
      case "lobby":
        if (is_lobby_owner) {
          line2 = "Start Game"
          line2_is_start_button = true
        }
        else { line2 = "Waiting for the host" }
        break;
      case "over":
        line1 = `${winning_user_name} wins the game!`
        if (is_lobby_owner) {
          line2 = "Start Game"
          line2_is_start_button = true
        }
        else { line2 = "Waiting for the host" }
        break;
      default: break;
    }
  }

  return <div className="statusThing">
    <h1>{line1}</h1>

    {line2_is_start_button?
      <button onClick={e=>fetchPatch("/start_game")}>{line2}</button>:
      <h2>{line2}</h2>
    }
  </div>
}