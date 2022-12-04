export function Home() {
  return <div id="home" className="col centered page">
    <h1>Change Log:</h1>

    <h2>
      v0.5.4 - 12/3/2022
    </h2>
    <ul>
      <li>New user validations
        <br/> - Username must be at least three characters
        <br/> - Username can only contain A-Z, a-z, 0-9, -, and _
        <br/> - User table has been dropped again
      </li>

      <li>Auto kick timer more forgiving</li>
      <li>Fix game ending one before winning score, I think, I cant recreate the bug in my dev environment</li>
      <li>Fix card drawing duplicates</li>
    </ul>

    <h2>
      v0.5.3 - 12/3/2022
    </h2>
    <ul>
      <li>Remove duplicate cards after game creation
        <br/> - Some sets in the create a lobby screen share cards, this made those cards appear too often, which was lame and sad.
      </li>
      <li>Update About/Legal/Credits pages</li>
    </ul>

    <h2>
      v0.5.2 - 11/24/2022
    </h2>
    <ul>
      <li>Fixed an issue where users sometimes failed to leave a game</li>
      <li>Add used card pools to prevent repeats until 'reshuffling'</li>
      <li>Fix game state related crash caused by the current Round/Lobby winner leaving the game</li>
      <li>Fix card czar leaving during Lobby/Over phase starting a new game</li>
    </ul>

    <h2>
      v0.5.1 - 11/23/2022
    </h2>
    <ul>
      <li>
        Try to fix "ghost lobbies" where people who close their browsers are still counted as in-game
        <br/>
        - I dropped the user table again for this, sorry
      </li>
    </ul>

    <h1>Known Bugs:</h1>
    <ul>
      <li>"Ghost Lobbies" still sometimes can occur</li>
    </ul>
  </div>
}