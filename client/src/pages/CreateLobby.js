import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LabeledInput } from "../components/LabeledInput";

export function CreateLobby({user}) {
  const navigate = useNavigate()
  if (!user) navigate("/")

  const [formObject, setFormObject] = useState({
    "winning_score": 8,
    "max_choose_phase_time": 180,
    "max_pick_phase_time": 360,
    "result_phase_time": 45,
    "hand_size": 5,
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
      <LabeledInput label="Hand Size" name="hand_size" type="number" value={formObject.hand_size} onChange={updateFormObject} step="1" min="3" max="25"/>
      <LabeledInput label="Lobby Password (Optional)" name="password" type="password" value={formObject.password} onChange={updateFormObject}/>

      <h3>Game Timings</h3>
      <LabeledInput label="Max Choose Phase Length" name="max_choose_phase_time" type="number" value={formObject.max_choose_phase_time} onChange={updateFormObject} step="30" min="30" max="600"/>
      <LabeledInput label="Max Pick Phase Length" name="max_pick_phase_time" type="number" value={formObject.max_pick_phase_time} onChange={updateFormObject} step="30" min="30" max="1200"/>
      <LabeledInput label="Round Result Display Time" name="result_phase_time" type="number" value={formObject.result_phase_time} onChange={updateFormObject} step="5" min="5" max="60"/>
      <button className="centered" type="submit">Submit</button>
    </form>
  </div>
}

