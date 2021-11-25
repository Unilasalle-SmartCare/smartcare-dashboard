import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CButton,
  CModal,
  CForm,
  CLabel,
  CInput,
  CTextarea,
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
import InputRange from '../../components/inputRange/InputRange'
import InputSwitch from '../../components/inputSwitch/InputSwitch'
import { request } from '../../services/request'

const Sensor = () => {

  // Modals
  const [modalActionVisibleState, setModalActionVisibleState] = useState(false)
  const [modalDataVisibleState, setModalDataVisibleState] = useState(false)
  const [modalDeleteVisibleState, setModalDeleteVisibleState] = useState(false)
  
  // Fields
  const [methodSubmitState, setMethodSubmitState] = useState("post")
  const [idState, setIdState] = useState()
  const [typeState, setTypeState] = useState("distance") // distance, presence
  const [nameState, setNameState] = useState("")
  const [directionState, setDirectionState] = useState(0) // for top
  const [wallDistanceState, setWallDistanceState] = useState(0)
  const [coordinateState, setCoordinateState] = useState() // { x, y, percentX, percentY, width, height }
  const [alertState, setAlertState] = useState(false)
  const [alertMessageState, setAlertMessageState] = useState("")
  const [alertRangeState, setAlertRangeState] = useState(0)
  
  const [loadingRequestState, setLoadingRequestState] = useState(false)
  const dispatch = useDispatch()
  const sensorsSelector = useSelector(({ sensors }) => sensors || [])
  
  const handleSensor = ( sensor ) => {
    
    setCoordinateState({ 
      x: sensor.x, 
      y: sensor.y, 
      percentX: sensor.percentX, 
      percentY: sensor.percentY,
      width: sensor.width, 
      height: sensor.height, 
    })
      
    if (sensor.id >= 0) {
      setIdState(sensor.id)
      setTypeState(sensor.type)
      setNameState(sensor.name)
      setDirectionState(sensor.direction)
      setWallDistanceState(sensor.wallDistance)
      setAlertState(sensor.alert)
      setAlertMessageState(sensor.alertMessage)
      setAlertRangeState(sensor.alertRange)
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
    sendData.name = nameState
    
    if (typeState === "distance") {
      sendData.direction = directionState
      sendData.wallDistance = wallDistanceState
    }

    sendData.alert = alertState
    sendData.alertMessage = alertMessageState
    sendData.alertRange = alertRangeState

    const response = await request({ 
      method: methodSubmitState, 
      endpoint: `${process.env.REACT_APP_BASE_API_URL}sensor`,
      data: sendData
    })
    
    if (response || true) {
      if (response?.success || true) {
        
        let responseFake
        switch (methodSubmitState) {
          case "put":
            responseFake = sensorsSelector.map((sensor) => {
              if (sensor.id === sendData.id) {
                return sendData
              }
              return sensor
            })
            break;
          case "delete":
            responseFake = sensorsSelector.filter((sensor) => sensor.id !== sendData.id)
            break;
          default:
            responseFake = [...sensorsSelector, { id: sensorsSelector.length, ...sendData}]
            break;
        }

        dispatch({type: 'set', sensors: responseFake })
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

  useEffect(() => {
    // Reset fields
    if (!(modalActionVisibleState || modalDataVisibleState || modalDeleteVisibleState)) {
      setMethodSubmitState("post")
      setIdState(undefined)
      setTypeState("distance")
      setNameState("")
      setDirectionState(0)
      setWallDistanceState(0)
      setCoordinateState(undefined)
      setAlertState(false)
      setAlertMessageState("")
      setAlertRangeState(0)
    }
  }, [modalActionVisibleState, modalDataVisibleState, modalDeleteVisibleState])

  return (
    <div className="smtc-sensor">
      <div className="smtc-sensor-wrapper">
        <div className="smtc-sensor-body">
          <Canvas
            data={sensorsSelector}
            callbackCoordinate={handleSensor}
          />
        </div>
      </div>
      <CModal centered={true} show={modalDataVisibleState} onClose={() => {
        setModalDataVisibleState(false)
      }}>
        <CForm onSubmit={handleSubmit}>
          <CModalHeader>
            <CModalTitle>Informe os dados do sensor!</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm="12">
                <InputRadioButton
                  value={typeState}
                  onChange={setTypeState}
                  items={[{
                    label: "Distância",
                    value: "distance"
                  }, {
                    label: "Presença",
                    value: "presence"
                  }]}
                />
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
            {typeState === "distance" && (
              <>
                <CRow className="mb-3 align-items-center">
                  <CCol className="col-12">
                    <CLabel>Direção</CLabel>
                  </CCol>
                  <CCol className="offset-sm-2 col-sm-6 col-10">
                    <InputRange
                      suffix="°"
                      maxValue={360}
                      minValue={0}
                      value={directionState}
                      onChange={setDirectionState}
                    />
                  </CCol>
                  <CCol className="col-2">
                    <div className="smtc-circle-ratation" style={{ transform: `rotate(${directionState}deg)` }}></div>
                  </CCol>
                </CRow>
                <CRow className="mb-3 align-items-center">
                  <CCol sm="12">
                    <CLabel>Distância da parede</CLabel>
                  </CCol>
                  <CCol className="offset-sm-2 col-sm-8">
                    <InputRange
                      suffix=" cm"
                      maxValue={200}
                      minValue={0}
                      value={wallDistanceState}
                      onChange={setWallDistanceState}
                    />
                  </CCol>
                </CRow>
              </>
            )}
            <hr />
            <CRow className="mb-3 align-items-center">
              <CCol className="col-2">
                <CLabel htmlFor="create-alert">Alerta</CLabel>
              </CCol>
              <CCol className="col-8">
                <InputSwitch
                  id="create-alert"
                  checked={alertState}
                  onChange={setAlertState}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol className="col-12">
                <CLabel htmlFor="create-message">Mensagem</CLabel>
              </CCol>
              <CCol className="col-12">
                <CTextarea placeholder="Mensagem" id="create-message" onChange={({ target: { value } }) => setAlertMessageState(value) } value={alertMessageState} rows="3"></CTextarea>
              </CCol>
            </CRow>
            {typeState === "distance" && (
              <CRow className="mb-3 align-items-center">
                <CCol sm="12">
                  <CLabel>Distância limite</CLabel>
                </CCol>
                <CCol className="offset-sm-2 col-sm-8">
                  <InputRange
                    suffix=" m"
                    maxValue={20}
                    minValue={0}
                    value={alertRangeState}
                    onChange={setAlertRangeState}
                  />
                </CCol>
              </CRow>
            )}
            {typeState === "presence" && (
              <CRow className="mb-3 align-items-center">
                <CCol sm="12">
                  <CLabel>Tempo limite</CLabel>
                </CCol>
                <CCol className="offset-sm-2 col-sm-8">
                  <InputRange
                    suffix=" min"
                    maxValue={10}
                    minValue={0}
                    value={alertRangeState}
                    onChange={setAlertRangeState}
                  />
                </CCol>
              </CRow>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => {
              if (methodSubmitState === "put") {
                setModalActionVisibleState(true)
              }
              setModalDataVisibleState(false)
            }}>
              Cancelar
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
          Ao confirmar a ação, o sensor será excluído do sistema.
        </CModalBody>
        <CModalFooter>
          <CButton type="button" color="secondary" onClick={() => {
            setModalActionVisibleState(true)
            setModalDeleteVisibleState(false)
          }}>
            Fechar
          </CButton>
          <CButton color="primary" type="button" className={`${loadingRequestState ? "loading" : ""}`} disabled={loadingRequestState} onClick={handleSubmit}>Confirmar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Sensor