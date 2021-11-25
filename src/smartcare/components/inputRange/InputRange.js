import React from 'react'
import { default as ComponentInputRange } from 'react-input-range'
import 'react-input-range/lib/css/index.css'
import './styles.scss'

const InputRange = ({ onChange, value, maxValue, minValue, suffix, disabled }) => {
  
  return (
    <div className="smtc-input-range">
      <div className="smtc-input-range-wrapper">
        <ComponentInputRange
          formatLabel={value => `${value}${suffix}`}
          maxValue={maxValue}
          minValue={minValue}
          value={value || 0}
          disabled={disabled}
          onChange={(changeValue) => onChange(changeValue)} />
      </div>
    </div>
  )
}

export default InputRange