import { useRef, useEffect, useState } from 'react';

export const RangeSlider = ({ min, max, values, onChange }) => {
   const [localValues, setLocalValues] = useState(values);
   const rangeRef = useRef(null);

   useEffect(() => {
      setLocalValues(values);
   }, [values]);

   const getPercent = (value) => {
      return Math.round(((value - min) / (max - min)) * 100);
   };

   const handleMinChange = (e) => {
      const value = Math.min(Number(e.target.value), localValues[1] - 1);
      setLocalValues([value, localValues[1]]);
   };

   const handleMaxChange = (e) => {
      const value = Math.max(Number(e.target.value), localValues[0] + 1);
      setLocalValues([localValues[0], value]);
   };

   const handleMouseUp = () => {
      onChange(localValues);
   };

   const minPercent = getPercent(localValues[0]);
   const maxPercent = getPercent(localValues[1]);

   return (
      <div className="RangeSlider">
         <div className="RangeSlider__track">
            <div 
               className="RangeSlider__range"
               style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
            />
         </div>
         <input
            type="range"
            className="RangeSlider__thumb RangeSlider__thumb--min"
            min={min}
            max={max}
            value={localValues[0]}
            onChange={handleMinChange}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
         />
         <input
            type="range"
            className="RangeSlider__thumb RangeSlider__thumb--max"
            min={min}
            max={max}
            value={localValues[1]}
            onChange={handleMaxChange}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
         />
      </div>
   );
};