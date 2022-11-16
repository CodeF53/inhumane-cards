import { cardRotation } from "../util";

export default function Card({ className, onClick, text, isPool, selected, controls, discarded, submitter, rotationSeed="" }) {
  return <div className={`card ${className} ${selected?"selected":""} ${discarded?"discarded":""}`} onClick={onClick} style={{"--rotation":cardRotation(rotationSeed+text)}}>
    {selected && !isPool && controls }
    {text}
    {selected && isPool  && controls }
    <div className="submitter">{submitter}</div>
  </div>
}