export function LabeledInput({label, name, type, value, onChange, step, min, max, className, amChecked}) {
  return <div className={"row labeled_input " + className}>
    <label htmlFor={name}>{label}</label>
    <div className="spacer"/>
    <input name={name} type={type} value={value} onChange={onChange} step={step} min={min} max={max} checked={amChecked}/>
  </div>
}