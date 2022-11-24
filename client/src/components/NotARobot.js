import { useState } from "react"
import { rand } from "../util"

import { ReactComponent as CheckSvg } from '../assets/check.svg';

export function NotARobot({onConfirm}) {
  const [state, setState] = useState("")

  function handleCheckboxClick(e) {
    setState("load")

    if (e.isTrusted) {
      setTimeout(()=>{
        setState("done")
        setTimeout(onConfirm, 3000)
      }, rand(2000, 30000))
    }
  }

  return <div id="notARobot" className="row">
    <div className="main centered row">
      <div className="thingy">
        {state === "" && <div className="checkbox" onClick={handleCheckboxClick}/>}
        {state === "load" && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
        {state === "done" && <CheckSvg/>}
      </div>
      <span>I'm not an asshole</span>
    </div>
    <div className="spacer"/>
    <div className="tag col centered">
      <div className="logo centered"/>
      <span className="name centered">deCOPTCHA</span>
      <div className="row info centered">
        <span>Privacy</span>
        <span>·</span>
        <span>Terms</span>
      </div>
    </div>
  </div>
}