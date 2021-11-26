import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {
  CButton,
  CCol,
  CLabel,
  CForm,
  CInput,
  CRow
} from '@coreui/react'

import { request } from '../../services/request'

const Patient = () => {

  const [usernameState, setUsernameState] = useState("")
  const [diseaseState, setDiseaseState] = useState("")
  const [diseaseLevelState, setDiseaseLevelState] = useState("")
  const [loadingRequestState, setLoadingRequestState] = useState(false)
  const dispatch = useDispatch()
  //const patientSelector = useSelector(({ patient }) => patient)

  const handleValidate = (e) => {

    const $form = e.currentTarget.form
    $form.classList.add("was-validated")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoadingRequestState(true)

    const response = await request({ 
      method: "post", 
      endpoint: `${process.env.REACT_APP_BASE_API_URL}patient`,
      data: {
        username: usernameState,
        disease: diseaseState,
        diseaseLevel: diseaseLevelState,
      }
    })

    if (response || true) {
      if (response?.success || true) {
        dispatch({type: 'set', patient: response?.data })
      } else {
        (response?.errors || []).foreach(error => {
          toast.error(`${error} 🤯`)
        })
      }
    }

    setLoadingRequestState(false)
  }

  return (
    <div className="smtc-floor-plan">
      <div className="smtc-floor-plan-wrapper">
        <div className="smtc-floor-plan-body">
          <CRow>
            <CCol className="offset-sm-4 col-sm-4">
              <CForm onSubmit={handleSubmit}>
                <h1>Cadastrar paciente</h1>
                <CRow className="mb-3 align-items-center">
                  <CCol className="col-12">
                    <CLabel htmlFor="patient-name">Nome</CLabel>
                  </CCol>
                  <CCol className="col-12">
                    <CInput type="text" placeholder="Nome" id="patient-name" onChange={({ target: { value } }) => setUsernameState(value) } value={usernameState} required />
                  </CCol>
                </CRow>
                <CRow className="mb-3 align-items-center">
                  <CCol className="col-12">
                    <CLabel htmlFor="disease">Doença</CLabel>
                  </CCol>
                  <CCol className="col-12">
                    <CInput type="text" placeholder="Doença" id="disease" onChange={({ target: { value } }) => setDiseaseState(value) } value={diseaseState} required />
                  </CCol>
                </CRow>
                <CRow className="mb-3 align-items-center">
                  <CCol className="col-12">
                    <CLabel htmlFor="disease-level">Grau da doença</CLabel>
                  </CCol>
                  <CCol className="col-12">
                    <CInput type="text" placeholder="Grau da doença" id="disease-level" onChange={({ target: { value } }) => setDiseaseLevelState(value) } value={diseaseLevelState} required />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol className="text-right offset-sm-6">
                    <CButton color="success" className={loadingRequestState ? "loading" : ""} type="submit" disabled={loadingRequestState} onClick={handleValidate}>Cadastrar paciente</CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  )
}

export default Patient
