import React from 'react'
import Switch from 'react-switch'
import './styles.scss'

const InputSwitch = ({ id, onChange, checked, disabled }) => {

  return (
    <div className="smtc-input-checkbox">
      <div className="smtc-input-checkbox-wrapper">
        <Switch
          id={id}
          offColor="#ced2d8"
          onColor="#321fdb"
          width={44}
          height={22}
          handleDiameter={24}
          checked={checked}
          disabled={disabled}
          onChange={(changeValue) => onChange(changeValue)} />
      </div>
    </div>
  )
}

export default InputSwitch