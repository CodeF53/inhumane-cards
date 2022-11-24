export function Home() {
  return <div id="home" className="col centered page">
    <h1>Change Log:</h1>

    <h2>
      v0.5.2
    </h2>
    <ul>
      <li>Fixed an issue where users sometimes failed to leave a game</li>
      <li>Add used card pools to prevent repeats until 'reshuffling'</li>
      <li>Fix game state related crash caused by the current Round/Lobby winner leaving the game</li>
    </ul>

    <h2>
      v0.5.1
    </h2>
    <ul>
      <li>
        Try to fix "ghost lobbies" where people who close their browsers are still counted as in-game
        <br/>
        - I dropped the user table again for this, sorry
      </li>
    </ul>
  </div>
}