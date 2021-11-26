import React, { useCallback, useEffect, useRef } from 'react'
import './styles.scss'
import { useDimension } from '../../hooks/useDimension'

const SIZE_ITEM_MIN = 1
const SIZE_ITEM_MAX = 3

const CanvasMonitoring = ({ data, floorPlan, callBackCanvasDimension }) => {

  const refCanvas = useRef()
  const refFloorPlan = useRef()
  const canvasDimension = useDimension(refFloorPlan)

  const helperResponsiveSize = useCallback(() => {
    const { width } = canvasDimension
    
    return Math.max(
      SIZE_ITEM_MIN, 
      Math.min(
        SIZE_ITEM_MAX, 
        (width * (SIZE_ITEM_MAX * 2)) / 1024))
  }, [canvasDimension])
  
  const drawData = useCallback((items) => {

    const ctx = refCanvas.current.getContext('2d')
    const { width: canvasWidth, height: canvasHeight } = canvasDimension
    
    const fixSize = helperResponsiveSize()

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.lineWidth = fixSize
    ctx.strokeStyle = "black"

    items.forEach((item, index) => {
      const currentX = canvasWidth * item.percentX
      const currentY = canvasHeight * item.percentY

      if (items[index + 1]) {
        const nextX = canvasWidth * items[index + 1].percentX
        const nextY = canvasHeight * items[index + 1].percentY
        
        ctx.beginPath()
        ctx.moveTo(currentX, currentY)
        ctx.lineTo(nextX, nextY)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.fillStyle = 'red'
        ctx.fillRect((currentX - (fixSize * 2)), (currentY - (fixSize * 2)), fixSize * 4, fixSize * 4)
      }

      if (index === 0) {
        ctx.beginPath()
        ctx.fillStyle = 'green'
        ctx.fillRect((currentX - (fixSize * 2)), (currentY - (fixSize * 2)), fixSize * 4, fixSize * 4)
      }
    })

  }, [canvasDimension, helperResponsiveSize])

  useEffect(() => {
    if (refCanvas.current && data) {
      drawData(data)
    }
  }, [data, drawData])

  useEffect(() => {

    callBackCanvasDimension(canvasDimension)
  }, [canvasDimension, callBackCanvasDimension])

  return (
    <div className="smtc-canvas">
      <div className="smtc-canvas-wrapper">
        {floorPlan && (
          <>
            <img 
              src={floorPlan} 
              alt="Planta baixa"
              ref={refFloorPlan}
            />
            <canvas
              width={canvasDimension.width}
              height={canvasDimension.height}
              ref={refCanvas}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default CanvasMonitoring