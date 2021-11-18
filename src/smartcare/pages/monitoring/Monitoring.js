import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import moment from 'moment'
import './styles.scss'
import InputDatePicker from '../../components/inputDatePicker/InputDatePicker'
import Canvas from '../../components/canvas/Canvas'
import { request } from '../../services/request'

const NOW = new Date();
const Monitoring = () => {
  
  const [loadingRequestState, setLoadingRequestState] = useState(false)
  const [fromRecordState, setFromRecordState] = useState();
  const [toRecordState, setToRecordState] = useState(NOW);

  useEffect(() => {
    
    const handleRequest = async () => {

      setLoadingRequestState(true);
      let invalidDate = false;
  
      if (moment(fromRecordState).isAfter(toRecordState)) {
        invalidDate = true
        toast.error("A data de início não pode ser maior que a data final");
      }
      
      if (moment(toRecordState).isBefore(fromRecordState)) {
        invalidDate = true
        toast.error("A data final não pode ser menor que a data de início");
      }

      if (moment(toRecordState).isAfter(NOW)) {
        invalidDate = true
        toast.error("A data final não pode ser maior que agora");
      }
      
      if (!invalidDate) {  
        const response = await request({ 
          method: "post", 
          endpoint: `${process.env.REACT_APP_BASE_API_URL}register`,
          params: {
            fromRecord: fromRecordState,
            toRecord: toRecordState
          }
        })
    
        if (response) {
          console.log(response)
        }
      }
      
      setLoadingRequestState(false);
    }

    if (fromRecordState && toRecordState) {
      handleRequest();
    }

  }, [fromRecordState, toRecordState]);

  return (
    <div className="smtc-monitoring">
      <div className="smtc-monitoring-wrapper">
        <div className="smtc-monitoring-header">
          <div className="smtc-header-controls">
            <InputDatePicker showTimeSelect label="Data inicial" value={fromRecordState} onChange={ setFromRecordState } disabled={loadingRequestState} />
            <InputDatePicker showTimeSelect label="Data final" value={toRecordState} onChange={ setToRecordState } disabled={loadingRequestState} />
          </div>
        </div>
        <div className="smtc-monitoring-body">
          <Canvas />
        </div>
      </div>
    </div>
  )
}

export default Monitoring