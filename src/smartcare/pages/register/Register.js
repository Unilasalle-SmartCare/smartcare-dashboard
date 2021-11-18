import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  // CCardFooter,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { request } from '../../services/request'

const Register = () => {

  const [usernameState, setUsernameState] = useState("")
  const [emailState, setEmailState] = useState("")
  const [passwordState, setPasswordState] = useState("")
  const [passwordConfirmationState, setPasswordConfirmationState] = useState("")
  const [loadingRequestState, setLoadingRequestState] = useState(false)
  const history = useHistory()

  const handleValidate = (e) => {

    const $form = e.currentTarget.form;
    $form.classList.add("was-validated");
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoadingRequestState(true)

    const response = await request({ 
      method: "post", 
      endpoint: `${process.env.REACT_APP_BASE_API_URL}register`,
      params: {
        username: usernameState,
        email: emailState,
        password: passwordState,
        passwordConfirmation: passwordConfirmationState,
      }
    })

    if (response || true) {
      history.push("/dashboard")
    }

    setLoadingRequestState(false)
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Cadastrar</h1>
                  <p className="text-muted">Cria sua conta</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Nome" autoComplete="username" onChange={({ target: { value } }) => setUsernameState(value) } value={usernameState} required />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Email" autoComplete="email" onChange={({ target: { value } }) => setEmailState(value) } value={emailState} required />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Senha" autoComplete="new-password" onChange={({ target: { value } }) => setPasswordState(value) } value={passwordState} minLength="6" required />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Confirmar senha" autoComplete="new-password" onChange={({ target: { value } }) => setPasswordConfirmationState(value) } value={passwordConfirmationState} minLength="6" pattern={passwordState} required />
                  </CInputGroup>
                  <CRow>
                    <CCol col="6">
                      <Link to="/login">
                        <CButton color="link">Voltar</CButton>
                      </Link>
                    </CCol>
                    <CCol col="6" className="text-right">
                      <CButton color="success" className={loadingRequestState ? "loading" : ""} type="submit" disabled={loadingRequestState} onClick={handleValidate}>Criar conta</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
