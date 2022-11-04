import { Fragment } from "react"
import { Link } from "react-router-dom"

export function Header({ user, setUser }) {
  const handleLogoutClick = () => {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) { setUser(null) }
    })
  }

  return <header>
    <Link to="/"><h1 className="logo">Inhumane<br/>Cards</h1></Link>
    <div className="spacer"/>

    <div className="row">
      {user? <Fragment>
        <Link to="/lobbies"><button>Join Lobby</button></Link>
        <Link to="/create_lobby"><button>Host Lobby</button></Link>

        <div className="spacer"/>

        <button onClick={handleLogoutClick}>Log Out</button>
      </Fragment>:<Fragment>
        <Link to="/login"><button>Log In</button></Link>
        <Link to="/signup"><button>Sign Up</button></Link>
      </Fragment>}
    </div>
  </header>
}