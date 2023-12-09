import {faImage, faPalette} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function RadioTogglers({options,defaultValue,onChange}) {
  return (
    <div className="radio-togglers shadow">
      {options.map(option => (
        <label key={option.value}>
          <input
            type="radio"
            name="bgType"
            onClick={ev => onChange(ev.target.value)}
            defaultChecked={defaultValue === option.value}
            value={option.value}/>
          <div>
            <FontAwesomeIcon icon={option.icon} />
            <span>{option.label}</span>
          </div>
        </label>
      ))}
    </div>
  );
}