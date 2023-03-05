import { useCallback } from 'react';


const useP5Event = (handler: Function, minX: Number, maxX: Number, minY: Number, maxY: Number) => {
  // @ts-ignore
  minX !== undefined && minX.constructor && minX.constructor.name === "Array" && ([minX, maxX, minY, maxY] = minX);
  // @ts-ignore
  minX !== undefined && maxX === undefined && (maxX = minX) && (minX = 0);
  // @ts-ignore
  minX !== undefined && minY === undefined && (maxY = maxX) && (minY = minX);
  // @ts-ignore
  return useCallback((p5, event) => {
    if (minX !== undefined && (p5.mouseX < minX || p5.mouseX > maxX || p5.mouseY < minY || p5.mouseY > maxY)) {
      return;
    }
    const ret = handler(p5, event);
    if (ret !== true) {
      event.preventDefault();
      event.stopPropagation();
      event.returnValue = '';
      return false;
    }
    return ret;
  }, [handler, minX, maxX, minY, maxY]);
};

export default useP5Event;