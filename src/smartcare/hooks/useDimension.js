import { useState, useCallback, useEffect } from "react";

const ORIGIN = Object.freeze({
  width: 0,
  height: 0,
});

export const useDimension = (ref) => {

  const [dimensionState, setDimensionState] = useState(ORIGIN);

  const setDimension = useCallback(() => {
    setDimensionState(() => {
      if (ref && ref.current) {
        const divRef = ref.current;
        const dimension = divRef.getBoundingClientRect();
        
        return {
          width: dimension.width,
          height: dimension.height,
        }
      }

      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    });
  }, [ref]);

  useEffect(() => {

    setDimension();
    window.addEventListener('resize', setDimension);

    return (() => {
      window.removeEventListener('resize', setDimension);
    });

  }, [setDimension]);

  return [dimensionState];
}