import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CButton,
  CModal,
  CForm,
  CLabel,
  CInput,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import './styles.scss'
import Canvas from '../../components/canvas/Canvas'
import InputRadioButton from '../../components/inputRadioButton/InputRadioButton'
import { request } from '../../services/request'

const Actuator = () => {

  const [readyState, setReadyState] = useState(true) // false 

  // Modals
  const [modalActionVisibleState, setModalActionVisibleState] = useState(false)
  const [modalDataVisibleState, setModalDataVisibleState] = useState(false)
  const [modalDeleteVisibleState, setModalDeleteVisibleState] = useState(false)
  const [modalTriggerVisibleState, setModalTriggerVisibleState] = useState(false)
  
  // Fields
  const [methodSubmitState, setMethodSubmitState] = useState("post")
  const [idState, setIdState] = useState()
  const [typeState, setTypeState] = useState("luz")
  const [codeState, setCodeState] = useState("")
  const [nameState, setNameState] = useState("")
  const [coordinateState, setCoordinateState] = useState() // { x, y, percentX, percentY, width, height }
  
  const [loadingRequestState, setLoadingRequestState] = useState(false)
  const dispatch = useDispatch()
  const floorPlanSelector = useSelector(({ floorPlan }) => floorPlan)
  const actuatorsSelector = useSelector(({ actuators }) => actuators || [])
  const [requestResponse, setRequestResponse] = useState(actuatorsSelector)
  
  const handleActuator = ( actuator ) => {
    
    setCoordinateState({ 
      x: actuator.x, 
      y: actuator.y, 
      percentX: actuator.percentX, 
      percentY: actuator.percentY,
      width: actuator.width, 
      height: actuator.height, 
    })
      
    if (actuator.id >= 0) {
      setIdState(actuator.id)
      setTypeState(actuator.type)
      setCodeState(actuator.code)
      setNameState(actuator.name)
      setModalActionVisibleState(true)
    } else {
      setMethodSubmitState("post")
      setModalDataVisibleState(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoadingRequestState(true)

    const sendData = {...coordinateState}

    if (methodSubmitState !== "post") {
      sendData.id = idState
    }

    sendData.type = typeState
    sendData.code = codeState
    sendData.name = nameState

    const response = await request({ 
      method: methodSubmitState, 
      endpoint: `${process.env.REACT_APP_BASE_API_URL}actuators`,
      data: sendData
    })
    
    if (response || true) {
      if (response?.success || true) {
        
        let responseFake
        switch (methodSubmitState) {
          case "put":
            responseFake = actuatorsSelector.map((actuator) => {
              if (actuator.id === sendData.id) {
                return sendData
              }
              return actuator
            })
            break;
          case "delete":
            responseFake = actuatorsSelector.filter((actuator) => actuator.id !== sendData.id)
            break;
          default:
            responseFake = [...actuatorsSelector, { id: actuatorsSelector.length, ...sendData}]
            break;
        }

        setRequestResponse(response?.data?.actuators ?? responseFake)
      } else {
        (response?.errors || []).foreach(error => {
          toast.error(`${error} 🤯`)
        })
      }
    }

    setModalDataVisibleState(false)
    setModalDeleteVisibleState(false)
    setLoadingRequestState(false)
  }

  const handleActive = async (e) => {
    e.preventDefault()

    setLoadingRequestState(true)

    const response = await request({ 
      method: methodSubmitState, 
      endpoint: `${process.env.REACT_APP_BASE_API_URL}actuator-active`,
      data: {
        id: idState,
        code: codeState
      }
    })
    
    if (response || true) {
      if (response?.success || true) {
        toast.success("Atuador acionado com sucesso! 👌")
      } else {
        (response?.errors || []).foreach(error => {
          toast.error(`${error} 🤯`)
        })
      }
    }

    setModalTriggerVisibleState(false)
    setLoadingRequestState(false)
  }

  useEffect(() => {
    // Reset fields
    if (!(modalActionVisibleState || modalDataVisibleState || modalDeleteVisibleState || modalTriggerVisibleState)) {
      setMethodSubmitState("post")
      setIdState()
      setTypeState("luz")
      setCodeState("")
      setNameState("")
      setCoordinateState()
    }
  }, [modalActionVisibleState, modalDataVisibleState, modalDeleteVisibleState, modalTriggerVisibleState])

  // useEffect(() => {
  //   const load = async () => {
  //     const response = await request({ 
  //       method: "get", 
  //       endpoint: `${process.env.REACT_APP_BASE_API_URL}actuators`
  //     })
  
  //     if (response || true) {
  //       if (response?.success || true) {
  //         setRequestResponse(response?.data?.actuators)
  //       } else {
  //         (response?.errors || []).foreach(error => {
  //           toast.error(`${error} 🤯`)
  //         })
  //       }
  //     }
      
  //     setReadyState(true)
  //   }

  //   load()
  // }, [])

  useEffect(() =>  {
    dispatch({ type: 'set', actuators: requestResponse })
  }, [requestResponse, dispatch])

  return (
    <div className="smtc-actuator">
      {readyState && floorPlanSelector &&
      <>
        <div className="smtc-actuator-wrapper">
          <div className="smtc-actuator-body">
            <Canvas
              data={actuatorsSelector}
              floorPlan={floorPlanSelector}
              callbackCoordinate={handleActuator}
              resetDraw={!(modalActionVisibleState || modalDataVisibleState || modalDeleteVisibleState || modalTriggerVisibleState)}
            />
          </div>
        </div>
        <CModal centered={true} show={modalDataVisibleState} onClose={() => {
          setModalDataVisibleState(false)
        }}>
          <CForm onSubmit={handleSubmit}>
            <CModalHeader>
              <CModalTitle>Informe os dados do atuador!</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow className="mb-3">
                <CCol sm="12">
                  <InputRadioButton
                    value={typeState}
                    onChange={setTypeState}
                    items={[{
                      label: "Luz",
                      value: "luz"
                    }, {
                      label: "Aroma",
                      value: "aroma"
                    }, {
                      label: "Som",
                      value: "som"
                    }, {
                      label: "Mídia",
                      value: "midia"
                    }]}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3 align-items-center">
                <CCol className="col-12">
                  <CLabel htmlFor="create-code">Código</CLabel>
                </CCol>
                <CCol className="col-12">
                  <CInput type="text" placeholder="Código" id="create-code" onChange={({ target: { value } }) => setCodeState(value) } value={codeState} required />
                </CCol>
              </CRow>
              <CRow className="mb-3 align-items-center">
                <CCol className="col-12">
                  <CLabel htmlFor="create-name">Nome</CLabel>
                </CCol>
                <CCol className="col-12">
                  <CInput type="text" placeholder="Nome" id="create-name" onChange={({ target: { value } }) => setNameState(value) } value={nameState} required />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => {
                if (methodSubmitState === "put") {
                  setModalActionVisibleState(true)
                }
                setModalDataVisibleState(false)
              }}>
                {methodSubmitState === "put" ? "Voltar" : "Cancelar"}
              </CButton>
              <CButton type="submit" color="primary" className={`${loadingRequestState ? "loading" : ""}`} disabled={loadingRequestState}>
                {methodSubmitState === "put" ? "Atualizar" : "Adicionar"}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
        <CModal centered={true} show={modalActionVisibleState} onClose={() => setModalActionVisibleState(false)}>
          <CModalHeader>
            <CModalTitle>Escolha a ação desejada para <strong>({nameState})</strong>!</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Por favor, escolha uma ação abaixo para dar continuidade.
          </CModalBody>
          <CModalFooter>
            <CButton type="button" color="secondary" onClick={() => setModalActionVisibleState(false)}>
              Cancelar
            </CButton>
            <CButton type="button" color="primary" onClick={() => {
              setMethodSubmitState("put")
              setModalDataVisibleState(true)
              setModalActionVisibleState(false)
            }}>Atualizar</CButton>
            <CButton type="button" color="warning" onClick={() => {
              setMethodSubmitState("post")
              setModalTriggerVisibleState(true)
              setModalActionVisibleState(false)
            }}>Ativar</CButton>
            <CButton type="button" color="danger" onClick={() => {
              setMethodSubmitState("delete")
              setModalDeleteVisibleState(true)
              setModalActionVisibleState(false)
            }}>Deletar</CButton>
          </CModalFooter>
        </CModal>
        <CModal centered={true} show={modalDeleteVisibleState} onClose={() => setModalDeleteVisibleState(false)}>
          <CModalHeader>
            <CModalTitle>Tem certeza?</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Ao confirmar a ação, o atuador será excluído do sistema.
          </CModalBody>
          <CModalFooter>
            <CButton type="button" color="secondary" onClick={() => {
              setModalActionVisibleState(true)
              setModalDeleteVisibleState(false)
            }}>
              Voltar
            </CButton>
            <CButton color="primary" type="button" className={`${loadingRequestState ? "loading" : ""}`} disabled={loadingRequestState} onClick={handleSubmit}>Confirmar</CButton>
          </CModalFooter>
        </CModal>
        <CModal centered={true} show={modalTriggerVisibleState} onClose={() => setModalTriggerVisibleState(false)}>
          <CModalHeader>
            <CModalTitle>Tem certeza?</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Ao confirmar a ação, o atuador será ativado na residência.
          </CModalBody>
          <CModalFooter>
            <CButton type="button" color="secondary" onClick={() => {
              setModalActionVisibleState(true)
              setModalTriggerVisibleState(false)
            }}>
              Voltar
            </CButton>
            <CButton color="primary" type="button" className={`${loadingRequestState ? "loading" : ""}`} disabled={loadingRequestState} onClick={handleActive}>Confirmar</CButton>
          </CModalFooter>
        </CModal>
      </>
      }
      {!floorPlanSelector && 
        <CModal centered={true} show={true}>
          <CModalHeader>
            <CModalTitle>Por favor, cadastre uma planta baixa</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Para utilizar este recurso do sistema é necessário que cadastre uma planta baixa da residência em que o paciente se encontra.
          </CModalBody>
        </CModal>
      }
    </div>
  )
}

export default Actuator