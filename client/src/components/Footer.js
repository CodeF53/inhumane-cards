import { Link } from "react-router-dom"

export function Footer() {
  return <footer className="row centered footer">
    <Link to="/about">About</Link>
    <Link to="/contact">Contact</Link>
    <Link to="/legal">Legal</Link>
    <Link to="/credits">Credits</Link>
    <Link to="/disclaimer">Disclaimer</Link>
    <a href="https://github.com/CodeF53/inhumane-cards/">Github</a>
  </footer>
}