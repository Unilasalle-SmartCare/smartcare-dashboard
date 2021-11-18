import React, { useState } from 'react'
import {
  CButton,
  CModal,
  CForm,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import './styles.scss'
import Canvas from '../../components/canvas/Canvas'

const Sensor = () => {

  const [modalActionVisibleState, setModalActionVisibleState] = useState(false)
  const [modalUpdateVisibleState, setModalUpdateVisibleState] = useState(false)
  const [modalDeleteVisibleState, setModalDeleteVisibleState] = useState(false)
  
  return (
    <div className="smtc-floor-plan">
      <div className="smtc-floor-plan-wrapper">
        <div className="smtc-floor-plan-body">
          <Canvas />
        </div>
      </div>
      <CModal centered={true} show={modalActionVisibleState} onClose={() => setModalActionVisibleState(false)}>
        <CModalHeader>
          <CModalTitle>Escolha a ação desejada!</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Por favor, escolha uma ação abaixo para dar continuidade.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalActionVisibleState(false)}>
            Cancelar
          </CButton>
          <CButton color="primary">Atualizar</CButton>
          <CButton color="danger" onClick={() => {
            setModalDeleteVisibleState(true)
            setModalActionVisibleState(false)
          }}>Deletar</CButton>
        </CModalFooter>
      </CModal>
      <CModal centered={true} show={modalUpdateVisibleState} onClose={() => {
        setModalUpdateVisibleState(false) 
        setModalActionVisibleState(true)
      }}>
        <CForm onSubmit={() => {}}>
          <CModalHeader>
            <CModalTitle>Escolha a ação desejada!</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Adicionar formulário
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => {
              setModalUpdateVisibleState(false) 
              setModalActionVisibleState(true)
            }}>
              Cancelar
            </CButton>
            <CButton color="primary">Atualizar</CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      <CModal centered={true} show={modalDeleteVisibleState} onClose={() => {
        setModalDeleteVisibleState(false)
        setModalActionVisibleState(true)
      }}>
        <CModalHeader>
          <CModalTitle>Tem certeza?</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Ao confirmar a ação, o sensor será excluído do sistema.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => {
            setModalDeleteVisibleState(false)
            setModalActionVisibleState(true)
          }}>
            Fechar
          </CButton>
          <CButton color="primary">Confirmar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Sensor