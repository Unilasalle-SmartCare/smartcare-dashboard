import React, { useEffect } from 'react'
import DatePicker, { registerLocale } from "react-datepicker"
import ptBR from 'date-fns/locale/pt-BR'
import './styles.scss'
import "react-datepicker/dist/react-datepicker.css"

const InputDatePicker = ({ showTimeSelect, label, value, onChange, disabled }) => {

  useEffect(() => {
    registerLocale('pt-br', ptBR);
  }, []);

  return (
    <div className="smtc-datepicker">
      <span className="date-label">{label}</span>
      <DatePicker showTimeSelect locale="pt-br" selected={value} dateFormat="dd/MM/yyyy" onChange={(date) => onChange(date)} disabled={!!disabled} />
    </div>
  )
}

export default InputDatePicker