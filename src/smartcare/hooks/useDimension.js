import { useState, useEffect } from "react"

const ORIGIN = Object.freeze({
  width: 0,
  height: 0,
})

export const useDimension = (ref) => {

  const [dimensionState, setDimensionState] = useState(ORIGIN)

  useEffect(() => {
    const setDimension = () => {
    
      if (ref && ref.current) {
        const element = ref.current
        const { width, height, x, y } = element.getBoundingClientRect()

        setDimensionState({ width, height, x, y })
      } else {

        setDimensionState({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    setDimension()
    window.addEventListener('resize', setDimension)

    return (() => {
      window.removeEventListener('resize', setDimension)
    })    
  }, [ref])
  
  return dimensionState
}