import React, { useEffect, useState } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import './styles.scss'
import { request } from '../../services/request'
import InputImageUploading from '../../components/inputImageUploading/InputImageUploading'

const REMOVE_FLOOR_PLAN = {}

const FloorPlan = () => {

  const [readyState, setReadyState] = useState(true) // false
  
  const [modalVisibleState, setModalVisibleState] = useState(false)
  const [loadingRequestState, setLoadingRequestState] = useState(false)
  const [methodSubmitState, setMethodSubmitState] = useState("post")
  
  const dispatch = useDispatch()
  const floorPlanSelector = useSelector(({ floorPlan }) => floorPlan)
  const [requestResponse, setRequestResponse] = useState(floorPlanSelector)

  const handleRequest = async (value) => {
    setLoadingRequestState(true)

    const response = await request({ 
      method: value ? methodSubmitState : "delete", 
      endpoint: `${process.env.REACT_APP_BASE_API_URL}floorPlan`,
      data: {
        floorPlan: value,
      }
    })
    
    setLoadingRequestState(false)
    setModalVisibleState(false)
    
    if (response || true) {
      if (response?.success || true) {
        setRequestResponse(response?.data?.floorPlan ?? value)
      } else {
        (response?.errors || []).foreach(error => {
          toast.error(`${error} 🤯`)
        })
      }
    }
  }

  const handleAction = (action) => {
    
    if (action) {
      setMethodSubmitState(action.method)

      if (action.method === "delete") {
        setModalVisibleState(true)
        REMOVE_FLOOR_PLAN.fn = action.handleFn
      } else {
        action.handleFn()
      }
    }
  }

  // useEffect(() => {
  //   const load = async () => {
  //     const response = await request({ 
  //       method: "get", 
  //       endpoint: `${process.env.REACT_APP_BASE_API_URL}floorPlan`
  //     })
  
  //     if (response || true) {
  //       if (response?.success || true) {
  //         setRequestResponse(response?.data?.floorPlan)
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
    dispatch({ type: 'set', floorPlan: requestResponse })
  }, [requestResponse, dispatch])
  
  return (
    <div className="smtc-floor-plan">
      {readyState && 
        <>
          <div className="smtc-floor-plan-wrapper">
            <div className="smtc-floor-plan-header">
              <InputImageUploading
                value={floorPlanSelector}
                handleAction={handleAction}
                handleRequest={handleRequest}
                loadingRequest={loadingRequestState}
              />
            </div>
          </div>
          <CModal centered={true} show={modalVisibleState} onClose={() => setModalVisibleState(false)}>
            <CModalHeader>
              <CModalTitle>Tem certeza?</CModalTitle>
            </CModalHeader>
            <CModalBody>
              Ao confirmar a ação, a planta baixa será excluída e você não poderá utilizar alguns recursos do sistema.
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModalVisibleState(false)}>
                Fechar
              </CButton>
              <CButton color="primary" className={`${loadingRequestState ? "loading" : ""}`} onClick={() => REMOVE_FLOOR_PLAN.fn()}>Confirmar</CButton>
            </CModalFooter>
          </CModal>
        </>
      }
    </div>
  )
}

export default FloorPlan