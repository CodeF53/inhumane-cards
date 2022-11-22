import { useState } from "react"
import { Link } from "react-router-dom"

export function Footer() {
  const [currentDonations, setCurrentDonations] = useState(0)
  const [donationGoal, setDonationGoal] = useState(156)
  // ! waiting on Ko-fi response on api for goals:
  // fetch("https://api.ko-fi.com/f53dev/goal/0")
  // .then(r=>r.json().then(d=>{
  //   setCurrentDonations(d.current)
  //   setDonationGoal(d.goal)
  // }))

  return <footer className="col centered footer">
    <div className="row centered donate">
      <div className="spacer"/>
      <div className="panel col">
        <h3 className="centered">2023 Server Costs</h3>

        <div className="progress row">
          <progress value={currentDonations} max={donationGoal}/>
          <span className="progressText">${currentDonations} of ${donationGoal}</span>
        </div>

        <a href="https://ko-fi.com/f53dev/goal?g=0" className="centered"><button>Donate</button></a>
      </div>
      <div className="spacer"/>
    </div>
    <div className="row centered links">
      <div className="spacer"/>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/legal">Legal</Link>
      <Link to="/credits">Credits</Link>
      <Link to="/disclaimer">Disclaimer</Link>
      <a href="https://github.com/CodeF53/inhumane-cards/">Github</a>
      <div className="spacer"/>
    </div>
  </footer>
}