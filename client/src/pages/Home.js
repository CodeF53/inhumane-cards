export function Home() {
  return <div id="home" className="col centered page">
    <h1>
      Beta V0.5.1
    </h1>
    <ul>
      <li>
        Try to fix "ghost lobbies" where people who close their browsers are still counted as in-game
        <br/>
        - I dropped the user table again for this, sorry
      </li>
    </ul>
  </div>
}