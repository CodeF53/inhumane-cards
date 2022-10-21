import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LabeledInput } from "../components/LabeledInput";

export function CreateLobby({user}) {
  const navigate = useNavigate()
  if (!user) navigate("/")

  const [formObject, setFormObject] = useState({
    "winning_score": 8,
    "player_limit": 10,
    "password": ""
  })
  const updateFormObject = ({target:{name, value}})=>setFormObject(formObject=>({...formObject, [name]: value}))
  function handleSubmit(e) {
    e.preventDefault()
    if (formObject.password === "") formObject.password = null

    fetch("/games",{
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formObject)
    }).then(r=>{ if (r.ok) { r.json().then(game=>{
      navigate("/game/"+game.id) // send user to game lobby
    })} else {
      r.json().then(({errors})=>{
        // setErrorText(errors[0])
      })
    }})
  }

  return <div className="col">
    <form onSubmit={handleSubmit} className="create_game centered col" id="log-form">
      <h1>Create Lobby</h1>
      <LabeledInput label="Winning Score" name="winning_score" type="number" value={formObject.winning_score} onChange={updateFormObject} step="1" min="3" max="100"/>
      <LabeledInput label="Player Limit"  name="player_limit"  type="number" value={formObject.player_limit}  onChange={updateFormObject} step="1" min="3" max="10"/>
      <LabeledInput label="Lobby Password (Optional)" name="password" type="password" value={formObject.password} onChange={updateFormObject}/>
      <button className="centered" type="submit">Submit</button>
    </form>
  </div>
}

