import React from 'react'
import { RadioGroup, RadioButton } from 'react-radio-buttons'
import './styles.scss'

const InputRadioButton = ({ onChange, value, items }) => {

  return (
    <div className="smtc-input-radio-button">
      <RadioGroup 
        horizontal
        value={value}
        onChange={(changeValue) => onChange(changeValue) } >
        {items.map((item, index) => (
          <RadioButton key={`radio-button-${item.value}-${index}`} value={item.value} disabled={item.disabled}>
            {item.label}
          </RadioButton>
        ))}  
      </RadioGroup>
    </div>
  )
}

export default InputRadioButton