import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export function LoginSignup({ isLogin, user, setUser }) {
  const navigate = useNavigate()
  if (user) navigate("/")

  const [username, setUsername]   = useState("")
  const [password, setPassword]   = useState("")
  const [errorText, setErrorText] = useState("")

  function handleSubmit(event) {
    event.preventDefault()

    if (username.length===0) { setErrorText("Username must be filled"); return; }
    else if (password.length<6) { setErrorText("Password must be at least 6 characters in length"); return; }
    else { setErrorText("") }

    fetch(isLogin?"/login":"/signup",{
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
    }).then(r=>{ if (r.ok) { r.json().then(user=>{
      setUser(user) // save user details
      navigate("/") // send user back to home
    })} else {
      r.json().then(({errors})=>{
        setErrorText(errors[0])
      })
    }})
  }

  let errorNode = errorText.length===0? null: (<span className="centered" style={{color:"red", textAlign:"center"}}>{errorText}</span>)

  return (
    <div className="col">
      <form onSubmit={handleSubmit} className="login centered col" id="log-form">
        <h1>{isLogin? "Log In": "Sign Up"}</h1>
        <input onChange={(e)=>{setUsername(e.target.value)}} value={username} placeholder="username" type="text"/>
        <input onChange={(e)=>{setPassword(e.target.value)}} value={password} placeholder="password" type="password"/>
        <div className="row">
          <button className="centered" type="submit">Submit</button>
          <div className="spacer"/>
          <span className="centered">{isLogin? "New?":"Not New?"} <Link style={{textDecoration:"underline"}} to={isLogin? "/signup":"/login"}>{isLogin? "Sign Up":"Log In"}</Link></span>
        </div>
      </form>
      {errorNode}
    </div>
  )
}