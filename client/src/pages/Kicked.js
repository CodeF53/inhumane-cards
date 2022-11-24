import { Link } from "react-router-dom";

export default function Kicked() {
  return <div className="col centered page">
    <h1>Kicked</h1>
    <p>
      Either the lobby owner kicked you, or your browser lost connection to the server for greater than 30 seconds.
    </p>
    <Link to="/"><button>Return Home</button></Link>
  </div>
}