import React, { useCallback } from "react";
import Sketch from "polyfills/react-p5";


const WIDTH = 500;
const HEIGHT = 500;

export default function Editor() {

  // @ts-ignore
  const setup = useCallback((p5) => {
    p5.createCanvas(WIDTH,HEIGHT);
    p5.noStroke();
  }, []);

  // @ts-ignore
  const draw = useCallback((p5) => {
    p5.background(0);
    p5.fill(255);
    p5.rect(0, 0, 100, 100);
  }, []);


  return (
    <div>
      <Sketch className={`the-sketch`} { ...{ setup, draw } } width={`${WIDTH}`} height={`${HEIGHT}`} />
    </div>
  );
}