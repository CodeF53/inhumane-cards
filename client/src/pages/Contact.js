import { useState } from "react"
import { NotARobot } from "../components/NotARobot"

export function Contact() {
  const [notAsshole, setNotAsshole] = useState(false)

  return <div className="col">
    <div className="col centered page">
      <h2>Contact:</h2>

      {notAsshole?
      <>
        <a href="mailto:fseusb@gmail.com">fseusb@gmail.com</a>
        <p>CodeF53#0241</p>
      </>:
      <>
        <h3>First, please confirm you are not an asshole:</h3>
        <div className="centered"><NotARobot onConfirm={e=>setNotAsshole(true)}/></div>
      </>}
    </div>
  </div>
}