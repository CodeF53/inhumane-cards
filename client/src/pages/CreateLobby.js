import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LabeledInput } from "../components/LabeledInput";
import { fetchPost_data } from "../util";

export function CreateLobby({user}) {
  const [errorText, setErrorText] = useState("")
  const navigate = useNavigate()
  if (!user) navigate("/")

  const [formObject, setFormObject] = useState({
    "winning_score": 8,
    "player_limit": 10,
    "password": "",
    enable_discards: false
  })
  const updateFormObject = ({target:{name, value}})=>setFormObject(formObject=>({...formObject, [name]: value}))
  const updateFormObject_checkbox = ({target:{name, checked}})=>setFormObject(formObject=>({...formObject, [name]: checked}))
  function handleSubmit(e) {
    e.preventDefault()
    if (formObject.password === "") formObject.password = null
    setErrorText("")

    fetchPost_data("/games",{...formObject, enabled_pack_ids: enabled_pack_ids})
      .then(r=>{r.json().then(d=>{
        if (r.ok) { navigate(`/game/${d.id}`) }
        else { setErrorText(d.errors[0]) }
    })})
  }

  const [categories, setCategories] = useState([])
  useEffect(() => { fetch("/card_categories").then(r=>r.json())
    .then(d=>setCategories(d.filter(category=>category.card_packs.length > 0)))}, [])

  const offishCats = categories.filter(category=>category.is_official)
  const unOffishCats = categories.filter(category=>!category.is_official)

  const [enabled_pack_ids, setEnabled_pack_ids] = useState([])
  const amChecked = id => enabled_pack_ids.includes(id)
  const add_pack_ids = ids => setEnabled_pack_ids([...enabled_pack_ids, ...ids])
  const rem_pack_ids = ids => setEnabled_pack_ids(enabled_pack_ids.filter(id=>!ids.includes(id)))
  const toggle_pack_id = id => {
    if (amChecked(id)) { rem_pack_ids([id]) }
    else { add_pack_ids([id]) }
  }
  const category_toggle_children = (e, category) => {
    const ids = category.card_packs.map(pack=>pack.id)
    if (e.target.checked) { add_pack_ids(ids) }
    else { rem_pack_ids(ids) }
    console.log(enabled_pack_ids);
  }

  const section_toggle_children = (e, section) => {
    const ids = section.map(category=>category.card_packs.map(pack=>pack.id)).flat()
    if (e.target.checked) { add_pack_ids(ids) }
    else { rem_pack_ids(ids) }
    ([...e.target.parentNode.parentNode.parentNode.childNodes].slice(1).map(d=>d.childNodes[0].childNodes[0].childNodes[2].checked = e.target.checked))
  }

  return <div className="col">
    <form onSubmit={handleSubmit} className="create_game centered col panel">
      <h1>Create Lobby</h1>
      <div className="centered col normal_options">
        <LabeledInput label="Winning Score" name="winning_score" type="number" value={formObject.winning_score} onChange={updateFormObject} step="1" min="3" max="100"/>
        <LabeledInput label="Player Limit"  name="player_limit"  type="number" value={formObject.player_limit}  onChange={updateFormObject} step="1" min="3" max="10"/>
        <LabeledInput label="Lobby Password (Optional)" name="password" type="password" value={formObject.password} onChange={updateFormObject}/>
        <LabeledInput label="Enable Discards" name="enable_discards" type="checkbox" value={formObject.password} onChange={updateFormObject_checkbox}/>
      </div>

      <div className="row">
        <div className="col">
          <h2>Select Packs:</h2>
          <span className="errors">{errorText}</span>
        </div>
        <div className="spacer"/>
        <button type="submit">Submit</button>
      </div>

      <details>
        <summary>
          {<LabeledInput label="Official" type="checkbox" className="packCheckBox section" onChange={e=>section_toggle_children(e, offishCats)}/>}
        </summary>

        {offishCats.map(category => <details key={category.title}>
          <summary>
            {<LabeledInput label={category.title} type="checkbox" className="packCheckBox category" onChange={e=>category_toggle_children(e, category)}/>}
          </summary>
          {category.card_packs.map(pack=>
            <LabeledInput label={pack.title} type="checkbox" className="packCheckBox pack" amChecked={amChecked(pack.id)} onChange={()=>toggle_pack_id(pack.id)} key={pack.id}/>
          )}
        </details>)}
      </details>

      <details>
        <summary>
          {<LabeledInput label="UnOfficial" type="checkbox" className="packCheckBox section" onChange={e=>section_toggle_children(e, unOffishCats)}/>}
        </summary>

        {unOffishCats.map(category => <details key={category.title}>
          <summary>
            {<LabeledInput label={category.title} type="checkbox" className="packCheckBox category" onChange={e=>category_toggle_children(e, category)}/>}
          </summary>
          {category.card_packs.map(pack=>
            <LabeledInput label={pack.title} type="checkbox" className="packCheckBox pack" amChecked={amChecked(pack.id)} onChange={()=>toggle_pack_id(pack.id)} key={pack.id}/>
          )}
        </details>)}
      </details>
    </form>
  </div>
}

