import React, { useState, useCallback, useEffect, useRef } from 'react'
import './styles.scss'
import { useSelector } from 'react-redux'
import { useDimension } from '../../hooks/useDimension'

const SIZE_ITEM_MIN = 10
const SIZE_ITEM_MAX = 20

const Canvas = ({ data, callbackCoordinate }) => {

  const refCanvas = useRef()
  const refFloorPlan = useRef()
  const canvasDimension = useDimension(refFloorPlan)
  const floorPlanSelector = useSelector(({ floorPlan }) => floorPlan)
  
  const [itemState, setItemState] = useState([])
  const [pressState, setPressState] = useState(false)

  const helperResponseCoordinate = useCallback((e) => {

    let pageX
    let pageY

    if (e.changedTouches && e.changedTouches.length) {
      const touch = e.changedTouches[0]
      pageX = touch.pageX
      pageY = touch.pageY
    } else {
      pageX = e.pageX
      pageY = e.pageY
    }

    const {x, y, width, height} = canvasDimension
    
    const offsetX = Math.min(width, Math.max(pageX - x, 0))
    const offsetY = Math.min(height, Math.max(pageY - y, 0))
    
    const offsetXPercent = (offsetX / width)
    const offsetYPercent = (offsetY / height)
    
    return ({ 
      x: offsetX, 
      y: offsetY, 
      percentX: offsetXPercent, 
      percentY: offsetYPercent,
      width, 
      height
    })
  }, [canvasDimension])

  const helperResponsiveSize = useCallback(() => {
    const { width } = canvasDimension
    
    return Math.max(
      SIZE_ITEM_MIN, 
      Math.min(
        SIZE_ITEM_MAX, 
        (width * (SIZE_ITEM_MAX * 2)) / 1024))
  }, [canvasDimension])

  const helperFindItem = useCallback((e) => {

    const { percentX, percentY, width, height } = helperResponseCoordinate(e)
    const offsetSize = helperResponsiveSize()
    
    const offsetSizeWidthPercent = ((offsetSize / width) / 2)
    const offsetSizeHeightPercent = ((offsetSize / height) / 2)

    return data.filter((item) => (
      percentX >= (item.percentX - offsetSizeWidthPercent) &&
      percentX <= (item.percentX + offsetSizeWidthPercent) &&
      percentY >= (item.percentY - offsetSizeHeightPercent) &&
      percentY <= (item.percentY + offsetSizeHeightPercent)
    ))

  }, [data, helperResponseCoordinate, helperResponsiveSize])
  
  const drawData = useCallback((items) => {

    const ctx = refCanvas.current.getContext('2d')
    const { width: canvasWidth, height: canvasHeight } = canvasDimension
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    items.forEach(item => {
      const x = canvasWidth * item.percentX
      const y = canvasHeight * item.percentY
      const fixSize = helperResponsiveSize()
      const centerSize = fixSize / 2
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((item.direction || 0) * Math.PI / 180)
      ctx.translate(-centerSize, -centerSize)
      
      switch (item.type) {
        case "distance":  
          const gradient = ctx.createLinearGradient(0, fixSize, 0, 0)
          gradient.addColorStop(0.5, "red")
          gradient.addColorStop(1, "transparent")
    
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(centerSize, fixSize)
          ctx.lineTo(fixSize, 0)
          ctx.fillStyle = gradient
          ctx.fill()
          break
        case "presence":
          ctx.beginPath()
          ctx.arc(centerSize, centerSize, centerSize, 0, 2 * Math.PI)
          ctx.strokeStyle = "red"
          ctx.lineWidth = centerSize / 2
          ctx.stroke()
          break
        default:
          ctx.strokeStyle= "red"
          ctx.lineWidth = centerSize / 2
          ctx.strokeRect(0, 0, fixSize, fixSize)
          break
      }
      
      ctx.restore()
    })

  }, [canvasDimension, helperResponsiveSize])

  const handleItemClick = useCallback((e) => {

    const { x, y, percentX, percentY, width, height } = helperResponseCoordinate(e)
    const [item] = itemState
    
    const offsetSize = helperResponsiveSize()
    const offsetSizeWidthPercent = ((offsetSize / width) / 2)
    const offsetSizeHeightPercent = ((offsetSize / height) / 2)

    if (!(
      percentX >= (item?.percentX - offsetSizeWidthPercent) &&
      percentX <= (item?.percentX + offsetSizeWidthPercent) &&
      percentY >= (item?.percentY - offsetSizeHeightPercent) &&
      percentY <= (item?.percentY + offsetSizeHeightPercent)
    )) {
      callbackCoordinate({ ...item, ...{ x, y, percentX, percentY, width, height } })
    } else {
      callbackCoordinate({ ...item })
    }

  }, [itemState, callbackCoordinate, helperResponsiveSize, helperResponseCoordinate])

  const handleItemDown = useCallback((e) => {

    const find = helperFindItem(e)
    setItemState(find)
    setPressState(true)
  }, [helperFindItem])
  
  const handleItemMove = useCallback((e) => {

    const { x, y, percentX, percentY } = helperResponseCoordinate(e)
    const canvas = refCanvas.current
    const [item] = itemState
    
    if (item && pressState) {
      canvas.classList.add("press-active")

      const moveItems = data.map((moveItem) => {
        if (moveItem.id === item.id) {
          return { ...item, ...{x, y, percentX, percentY} }
        }
        return moveItem
      })

      drawData(moveItems)

    } else {
      canvas.classList.remove("press-active")
      const find = helperFindItem(e)

      if (find.length) {
        canvas.classList.add("hover-active")
      } else {
        canvas.classList.remove("hover-active")
      }
    } 
  }, [data, itemState, pressState, helperResponseCoordinate, helperFindItem, drawData])

  const handleItemUp = useCallback((e) => {

    setPressState(false)
    if (e.changedTouches && e.changedTouches.length) {
      handleItemClick(e)
    }
  }, [handleItemClick])

  useEffect(() => {
    if (refCanvas.current) {
      const canvas = refCanvas.current
      
      canvas.addEventListener('click', handleItemClick)
      canvas.addEventListener('mousedown', handleItemDown)
      window.addEventListener('mousemove', handleItemMove)
      window.addEventListener('mouseup', handleItemUp)
      canvas.addEventListener('touchstart', handleItemDown)
      window.addEventListener('touchmove', handleItemMove)
      window.addEventListener('touchend', handleItemUp)
      
      return (() => {
        canvas.removeEventListener('click', handleItemClick)
        canvas.removeEventListener('mousedown', handleItemDown)
        window.removeEventListener('mousemove', handleItemMove)
        window.removeEventListener('mouseup', handleItemUp)
        canvas.removeEventListener('touchstart', handleItemDown)
        window.removeEventListener('touchmove', handleItemMove)
        window.removeEventListener('touchend', handleItemUp)
      })
    }
  }, [handleItemClick, handleItemDown, handleItemMove, handleItemUp])

  useEffect(() => {
    if (refCanvas.current && data) {
      drawData(data)
    }
  }, [data, drawData])

  return (
    <div className="smtc-canvas">
      <div className="smtc-canvas-wrapper">
        {floorPlanSelector && (
          <>
            <img 
              src={floorPlanSelector} 
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

export default Canvas