import { useEffect, useState } from "react";
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
      navigate("/game/") // send user to game lobby
    })} else {
      r.json().then(({errors})=>{
        // setErrorText(errors[0])
      })
    }})
  }

  const [categories, setCategories] = useState([])
  useEffect(() => { fetch("/card_categories").then(r=>r.json())
    .then(d=>setCategories(d.filter(category=>category.card_packs.length > 0)))}, [])

  const offishCats = categories.filter(category=>category.is_official)
  const unOffishCats = categories.filter(category=>!category.is_official)

  // TODO Hook up checkboxes
  return <div className="col">
    <form onSubmit={handleSubmit} className="create_game centered col panel">
      <h1>Create Lobby</h1>
      <LabeledInput label="Winning Score" name="winning_score" type="number" value={formObject.winning_score} onChange={updateFormObject} step="1" min="3" max="100"/>
      <LabeledInput label="Player Limit"  name="player_limit"  type="number" value={formObject.player_limit}  onChange={updateFormObject} step="1" min="3" max="10"/>
      <LabeledInput label="Lobby Password (Optional)" name="password" type="password" value={formObject.password} onChange={updateFormObject}/>

      <div className="row">
        <div className="spacer"/>
        <button className="centered" type="submit">Submit</button>
      </div>

      <h2>Select Packs:</h2>

      <details>
        <summary>
          {<LabeledInput label="Official" type="checkbox" className="packCheckBox section"/>}
        </summary>

        {offishCats.map(category => <details>
          <summary>
            {<LabeledInput label={category.title} type="checkbox" className="packCheckBox category"/>}
          </summary>
          {category.card_packs.map(pack=><LabeledInput label={pack.title} type="checkbox" className="packCheckBox pack"/>)}
        </details>)}
      </details>

      <details>
        <summary>
          {<LabeledInput label="UnOfficial" type="checkbox" className="packCheckBox section"/>}
        </summary>

        {unOffishCats.map(category => <details>
          <summary>
            {<LabeledInput label={category.title} type="checkbox" className="packCheckBox category"/>}
          </summary>
          {category.card_packs.map(pack=><LabeledInput label={pack.title} type="checkbox" className="packCheckBox pack"/>)}
        </details>)}
      </details>
    </form>
  </div>
}

