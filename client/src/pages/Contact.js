import { NotARobot } from "../components/NotARobot"

export function Contact() {
  return <div className="col centered page">
    <h1>Contact:</h1>
    <div className="centered"><NotARobot onConfirm={e=>window.location.assign("https://f53.dev")}/></div>
  </div>
}