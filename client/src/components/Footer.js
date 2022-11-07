import { Link } from "react-router-dom"

export function Footer() {
  return <div className="col">
    <div className="row centered footer">
      <Link to="about">About</Link>
      <Link to="contact">Contact</Link>
      <Link to="legal">Legal</Link>
      <Link to="credits">Credits</Link>
    </div>
  </div>
}