import React, { useEffect, useState, useCallback } from 'react'
import {
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody
} from '@coreui/react'
import { toast } from 'react-toastify'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import './styles.scss'
import InputDatePicker from '../../components/inputDatePicker/InputDatePicker'
import CanvasMonitoring from '../../components/canvasMonitoring/CanvasMonitoring'
import { request } from '../../services/request'

const Monitoring = () => {
  
  const [readyState, setReadyState] = useState(true) // false
  const [canvasDimensionState, setCanvasDimensionState] = useState()

  const [loadingRequestState, setLoadingRequestState] = useState(false)
  const [fromRecordState, setFromRecordState] = useState()
  const [toRecordState, setToRecordState] = useState(new Date())
  const [realState, setRealState] = useState(true)

  const dispatch = useDispatch()
  const floorPlanSelector = useSelector(({ floorPlan }) => floorPlan)
  const monitoringSelector = useSelector(({ monitoring }) => monitoring || [])
  const [requestResponse, setRequestResponse] = useState([])

  const generateData = useCallback(() => {
    
    if (canvasDimensionState) {
      const { width, height } = canvasDimensionState
      const posX = Math.random() * width
      const posY = Math.random() * height
  
      return { 
        x: posX, 
        y: posY, 
        percentX: posX / width, 
        percentY: posY / height
      }
    }
  }, [canvasDimensionState])


  useEffect(() => {
    
    const handleRequest = async () => {

      setLoadingRequestState(true)
      let invalidDate = false
  
      if (moment(fromRecordState).isAfter(toRecordState)) {
        invalidDate = true
        toast.error("A data de início não pode ser maior que a data final")
      }
      
      if (moment(toRecordState).isBefore(fromRecordState)) {
        invalidDate = true
        toast.error("A data final não pode ser menor que a data de início")
      }

      if (moment(toRecordState).isAfter(new Date())) {
        invalidDate = true
        toast.error("A data final não pode ser maior que agora")
      }
      
      if (!invalidDate) {  
        const response = await request({ 
          method: "get", 
          endpoint: `${process.env.REACT_APP_BASE_API_URL}monitoring`,
          data: {
            fromRecord: fromRecordState,
            toRecord: toRecordState,
          }
        })
        
        setLoadingRequestState(false)
        
        if (response || true) {
          if (response?.success || true) {
            setRequestResponse(response?.data?.monitoring ?? [])
          } else {
            (response?.errors || []).foreach(error => {
              toast.error(`${error} 🤯`)
            })
          }
        }
      }
      
      setLoadingRequestState(false);
    }

    if (fromRecordState && toRecordState) {
      handleRequest()
      setRealState(false)
    }

  }, [fromRecordState, toRecordState])

  // useEffect(() => {
  //   const load = async () => {
  //     const response = await request({ 
  //       method: "get", 
  //       endpoint: `${process.env.REACT_APP_BASE_API_URL}sensors`
  //     })
  
  //     if (response || true) {
  //       if (response?.success || true) {
  //         setRequestResponse(response?.data?.sensors)
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
    dispatch({ type: 'set', monitoring: requestResponse })
  }, [requestResponse, dispatch])

  useEffect(() => {
    const TIMER = 3000
    const LIMIT = 6
    
    const generateFn = () => {
      const generate = generateData()
      if (generate) {
        const path = [...requestResponse, generate]
  
        if (path.length > LIMIT) {
          path.shift()
        }
        setRequestResponse(path)
      }
    }

    const interval = setInterval(generateFn, TIMER)

    if (!realState) {
      clearInterval(interval)
    }

    return (() => {
      if (requestResponse.length === 0) {
        generateFn()
      }
      clearInterval(interval)
    })

  }, [requestResponse, realState, generateData])

  useEffect(() => {
    if (realState) {
      setFromRecordState()
      setToRecordState(new Date())
    }
  }, [realState])

  return (
    <div className="smtc-monitoring">
      {readyState && floorPlanSelector &&
        <div className="smtc-monitoring-wrapper">
          <div className="smtc-monitoring-header">
            <div className="smtc-header-controls">
              <InputDatePicker showTimeSelect label="Data inicial" value={fromRecordState} onChange={ setFromRecordState } disabled={loadingRequestState} />
              <InputDatePicker showTimeSelect label="Data final" value={toRecordState} onChange={ setToRecordState } disabled={loadingRequestState} />
              {!realState &&
                <CButton 
                  type="button" 
                  color="primary" 
                  onClick={() => setRealState(true)}
                >
                  Tempo real
                </CButton>
              }
            </div>
          </div>
          <CRow className="mt-4 text-center">
            <CCol className="col-12">
              <h4>{(realState && "Apresentação em tempo real") || "Apresentação gravada"}</h4>
            </CCol>
          </CRow>
          <div className="smtc-monitoring-body">
            <CanvasMonitoring 
              floorPlan={floorPlanSelector}
              data={monitoringSelector}
              callBackCanvasDimension={(size) => setCanvasDimensionState(size)}
            />
          </div>
        </div>
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

export default Monitoring