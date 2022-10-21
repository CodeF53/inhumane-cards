export function GameLobby({ lobby: {id, host, password_protected, num_players}}) {
  return <div className="row">
    {host}'s game
    {password_protected?"password_protected":""}
    {num_players} players
  </div>
}