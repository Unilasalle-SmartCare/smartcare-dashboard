import React, { useState } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import './styles.scss'
import { request } from '../../services/request'
import InputImageUploading from '../../components/inputImageUploading/InputImageUploading'

const REMOVE_FLOOR_PLAN = {}

const FloorPlan = () => {

  const [modalVisibleState, setModalVisibleState] = useState(false)
  const [loadingRequestState, setLoadingRequestState] = useState(false)
  
  const dispatch = useDispatch()
  const floorPlanSelector = useSelector(({ floorPlan }) => floorPlan)

  const handleRequest = async ({ method, value }) => {
    setModalVisibleState(false)
    setLoadingRequestState(true)

    const response = await request({ 
      method: method, 
      endpoint: `${process.env.REACT_APP_BASE_API_URL}floorPlan`,
      data: {
        floorPlan: value,
      }
    })
    
    setLoadingRequestState(false)

    if (response || true) {
      if (response?.success || true) {
        dispatch({ type: 'set', floorPlan: value })
        return true
      }
    }

    return false
  }

  const handleAction = ({ method, actionFn }) => {

    if (method === "DELETE") {
      setModalVisibleState(true)
      REMOVE_FLOOR_PLAN.fn = actionFn
    } else {
      actionFn()
    }
  }
  
  return (
    <div className="smtc-floor-plan">
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
          <CButton color="primary" onClick={REMOVE_FLOOR_PLAN.fn}>Confirmar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default FloorPlan