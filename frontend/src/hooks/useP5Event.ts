import { useCallback } from 'react';
import type p5 from 'p5';

type P5Event = (p5: p5, event: Event) => boolean | void;

type num4 = [number, number, number, number];

const useP5Event = (handler: P5Event, bounds: num4) => {
  const [minX, maxX, minY, maxY] = bounds;
  return useCallback((p5: p5, event: Event) => {
    if (minX !== undefined && (p5.mouseX < minX || p5.mouseX > maxX || p5.mouseY < minY || p5.mouseY > maxY)) {
      return;
    }
    const ret = handler(p5, event);
    if (ret !== true) {
      event.preventDefault();
      event.stopPropagation();
      // event.returnValue = '';
      return false;
    }
    return ret;
  }, [handler, minX, maxX, minY, maxY]);
};

export default useP5Event;