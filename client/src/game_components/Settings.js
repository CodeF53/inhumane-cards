import { useEffect, useState } from 'react';
import { ReactComponent as SettingsSvg } from '../assets/settings.svg';
import { ReactComponent as XSvg } from '../assets/x.svg';
import { LabeledInput } from '../components/LabeledInput';

// ! This entire file is almost vomit inducing
// TODO: Refactor
export default function Settings() {
  const [inv_layout, setInv_layout] = useState(JSON.parse(localStorage.getItem("inv_layout")))
  useEffect(() => { localStorage.setItem("inv_layout", JSON.stringify(inv_layout)) }, [inv_layout])
  useEffect(() => { if (inv_layout === null || inv_layout === undefined) setInv_layout(false) }, [])

  // const [enable_sfx, setEnable_sfx] = useState(JSON.parse(localStorage.getItem("enable_sfx")))
  // useEffect(() => { localStorage.setItem("enable_sfx", JSON.stringify(enable_sfx)) }, [enable_sfx])
  // useEffect(() => { if (enable_sfx === null || enable_sfx === undefined) setEnable_sfx(true) }, [])

  // const [enable_tilt, setEnable_tilt] = useState(JSON.parse(localStorage.getItem("enable_tilt")))
  // useEffect(() => { localStorage.setItem("enable_tilt", JSON.stringify(enable_tilt)) }, [enable_tilt])
  // useEffect(() => { if (enable_tilt === null || enable_tilt === undefined) setEnable_tilt(true) }, [])

  const [displayingModal, setDisplayingModal] = useState(false)

  return <>
    <button className="settings-button" onClick={()=>setDisplayingModal(true)}>
      <SettingsSvg/>
    </button>

    {displayingModal && <div className="modal-bg" onClick={()=>setDisplayingModal(false)}>
      <div className="panel col" onClick={e=>e.stopPropagation()}>
        <div className="row centerChildren">
          <h1>Settings:</h1>
          <div className="spacer"/>
          <button className="close" onClick={()=>setDisplayingModal(false)}><XSvg/></button>
        </div>

        <LabeledInput type="checkbox" onChange={()=>{setInv_layout(!inv_layout); window.location.reload();}} amChecked={inv_layout}
          label="Force Inverse Layout" name="inv_layout"/>

        {/* <LabeledInput type="checkbox" onChange={()=>setEnable_sfx(!enable_sfx)} amChecked={enable_sfx}
          label="Sound Effects" name="enable_sfx"/>

        <LabeledInput type="checkbox" onChange={()=>setEnable_tilt(!enable_tilt)} amChecked={enable_tilt}
          label="Do card tilt" name="enable_tilt"/> */}
      </div>
    </div>}
  </>
}