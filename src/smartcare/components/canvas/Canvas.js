import React, { useRef } from 'react'
import './styles.scss'
import { useDimension } from '../../hooks/useDimension'

const Canvas = () => {

  const refWrapper = useRef()
  const refCanvas = useRef()
  const [refWrapperDimension] = useDimension(refWrapper)

  return (
    <div className="smtc-canvas">
      <div className="smtc-canvas-wrapper" ref={refWrapper}>
        <canvas
          width={refWrapperDimension.width}
          height={refWrapperDimension.height}
          ref={refCanvas}
        />
      </div>
    </div>
  )
}

export default Canvas