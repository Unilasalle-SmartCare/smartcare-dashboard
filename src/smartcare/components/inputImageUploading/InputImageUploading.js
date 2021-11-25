import React, { useEffect, useState } from 'react'
import { CButton } from '@coreui/react'
import ImageUploading from 'react-images-uploading'
import { toast } from 'react-toastify'
import './styles.scss'

const InputImageUploading = ({ value, loadingRequest, handleAction, handleRequest }) => {

  const [imageState, setImageState] = useState(value ? [value] : [])

  const onChange = (imageList) => {
    handleRequest(imageList[0]?.data_url)
  }

  const onError = (errors) => {

    errors?.maxNumber && toast.error("Desculpa, O número de imagens selecionadas excede o limite.")
    errors?.acceptType && toast.error("Desculpa, Seu tipo de arquivo selecionado não é permitido.")
    errors?.maxFileSize && toast.error("Desculpa, O tamanho do arquivo selecionado excede o limite.")
    errors?.resolution && toast.error("O arquivo selecionado não corresponde à resolução desejada.")
  }

  const handleClick = (action) => {
    handleAction(action)
  }

  useEffect(() => {
    setImageState(value ? [value] : [])
  }, [value])

  return (
    <ImageUploading
        value={imageState}
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
          <div className="upload__image-wrapper">
            {!imageList.length && (
              <CButton 
                color="primary" 
                onClick={() => handleClick({ method: "post", handleFn: onImageUpload }) } 
                className={`${loadingRequest ? "loading" : ""}`} 
                disabled={loadingRequest}>Cadastrar</CButton>
            )}
            {imageList.map((image, index) => 
              <div key={index} className="image-item">
                <div className="image-wrapper">
                  <img src={imageState[index]} alt="" />
                </div>
                <div className="image-item__btn-wrapper">
                  <CButton color="warning" onClick={() => handleClick({ method: "put", handleFn: () => onImageUpdate(index) }) } disabled={loadingRequest}>Atualizar</CButton>
                  <CButton color="danger" onClick={() => handleClick({ method: "delete", handleFn: () => onImageRemove(index) }) } disabled={loadingRequest}>Remover</CButton>
                </div>
              </div>
            )}
          </div>
        )}
      </ImageUploading>
  )
}

export default InputImageUploading