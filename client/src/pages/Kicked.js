import { Link } from "react-router-dom";

export default function Kicked() {
  return <div className="col centered page">
    <h1>Kicked</h1>
    <p>You were kicked from the game</p>
    <Link to="/"><button>Return Home</button></Link>
  </div>
}