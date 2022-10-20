import { Fragment } from "react"
import { Link, Route } from "react-router-dom"

export function Header({ user, setUser }) {
  const handleLogoutClick = () => {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) { setUser(null) }
    })
  }

  return <header className="row">
    <Link to="/"><h1 className="logo">Inhumane<br/>Cards</h1></Link>
    <div className="spacer"/>
    { user?
      <button onClick={handleLogoutClick}>Log Out</button>:
      <Fragment>
        <Link to="login"><button>Log In</button></Link>
        <Link to="signup"><button>Sign Up</button></Link>
      </Fragment>
    }
  </header>
}