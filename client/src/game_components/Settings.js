import { useEffect, useState } from 'react';
import { ReactComponent as SettingsSvg } from '../assets/settings.svg';
import { ReactComponent as XSvg } from '../assets/x.svg';
import { LabeledInput } from '../components/LabeledInput';
import { getIsMobile } from '../util';

// ! This entire file is almost vomit inducing
// TODO: Refactor
export default function Settings() {
  const [inv_layout, setInv_layout] = useState(JSON.parse(localStorage.getItem("inv_layout")))
  useEffect(() => { localStorage.setItem("inv_layout", JSON.stringify(inv_layout)) }, [inv_layout])
  useEffect(() => { if (inv_layout === null || inv_layout === undefined) setInv_layout(false) }, [])

  const [isMobile, ] = useState(getIsMobile())

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
          label={`Force ${isMobile?"Desktop":"Mobile"} Layout`} name="inv_layout"/>
      </div>
    </div>}
  </>
}