import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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

const Login = () => {

  const [emailState, setEmailState] = useState("")
  const [passwordState, setPasswordState] = useState("")
  const [loadingRequestState, setLoadingRequestState] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const userSelector = useSelector(({ user }) => user)

  const handleValidate = (e) => {
        
    const $form = e.currentTarget.form
    $form.classList.add("was-validated")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoadingRequestState(true)

    const response = await request({ 
      method: "post", 
      endpoint: `${process.env.REACT_APP_BASE_API_URL}login`,
      data: {
        email: emailState,
        password: passwordState,
      }
    })
    
    if (response || true) {
      if (response?.success || true) {
        dispatch({type: 'set', user: response?.data })
      } else {
        (response?.errors || []).foreach(error => {
          toast.error(`${error} 🤯`)
        })
      }
    }

    setLoadingRequestState(false)
  }

  useEffect(() => {
    if (userSelector) {
      history.push("/dashboard")
    }
  }, [userSelector, history])

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup className="flex-md-down-column">
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-muted">Faça login em sua conta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="email" placeholder="Email" autoComplete="email" onChange={({ target: { value } }) => setEmailState(value) } value={emailState} required />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password" onChange={({ target: { value } }) => setPasswordState(value) } value={passwordState} minLength="6" required />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="12" className="text-right">
                        <CButton color="primary" className={`px-4 ${loadingRequestState ? "loading" : ""}`} type="submit" disabled={loadingRequestState} onClick={handleValidate}>Login</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5">
                <CCardBody className="text-center">
                  <div>
                    <h2>Cadastre-se</h2>
                    <p>Cadastre-se em nosso sistema, e conte com uma tecnologia avançada para o monitoramento a distância.</p>
                    <Link to="/register">
                      <CButton tag="span" color="primary" className="mt-3" tabIndex={-1}>Cadastra-se agora</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
