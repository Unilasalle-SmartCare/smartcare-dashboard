import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import ImageUploading from 'react-images-uploading'
import { toast } from 'react-toastify'
import './styles.scss'

const InputImageUploading = ({ value, loadingRequest, handleAction, handleRequest }) => {

  const [methodState, setMethodState] = useState("POST")

  const onChange = (imageList) => {

    handleRequest({ method: methodState, value: imageList })
  }

  const onError = (errors) => {

    errors?.maxNumber && toast.error("Desculpa, O número de imagens selecionadas excede o limite.")
    errors?.acceptType && toast.error("Desculpa, Seu tipo de arquivo selecionado não é permitido.")
    errors?.maxFileSize && toast.error("Desculpa, O tamanho do arquivo selecionado excede o limite.")
    errors?.resolution && toast.error("O arquivo selecionado não corresponde à resolução desejada.")
  }

  const handleClick = ({ method, actionFn }) => {

    setMethodState(method)
    handleAction({ method, actionFn })
  }

  return (
    <ImageUploading
        value={value}
        onChange={onChange}
        onError={onError}
        dataURLKey="data_url"
        acceptType={['jpg', 'png']}
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            {!imageList.length && <CButton color="primary" onClick={() => handleClick({ method: "POST", actionFn: () => onImageUpload() }) } disabled={loadingRequest}>Cadastrar</CButton>}
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <div className="image-wrapper">
                  <img src={image['data_url']} alt="" />
                </div>
                <div className="image-item__btn-wrapper">
                  <CButton color="warning" onClick={() => handleClick({ method: "PUT", actionFn: () => onImageUpdate(index) }) } disabled={loadingRequest}>Atualizar</CButton>
                  <CButton color="danger" onClick={() => handleClick({ method: "DELETE", actionFn: () => onImageRemove(index) }) } disabled={loadingRequest}>Remover</CButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
  )
}

export default InputImageUploading