import React, { useCallback } from "react";

import type p5 from "p5";
import P5Sketch from "~/components/p5-sketch";

import dummyImg from "~/assets/dummyImg.png";

const WIDTH = 500;
const HEIGHT = 500;

const TOOLS = [
  "pen",
  "highlighter",
  "eraser",
] as const;

type ToolName = typeof TOOLS[number];

interface EditorProps {
  canvasRendererRef: React.MutableRefObject<p5.Renderer | undefined>;
  activeTool: ToolName;
}

const EditorComponent: React.FC<EditorProps> = ({ canvasRendererRef }: EditorProps) => {

  let backgroundImage: p5.Image;

  const preload = useCallback((p5: p5) => {
    backgroundImage = p5.loadImage(dummyImg.src);
    console.log("preload", backgroundImage);
  }, []);
  
  const setup = useCallback((p5: p5, parent: HTMLDivElement) => {
    // console.log("setup");
    canvasRendererRef.current = p5.createCanvas(WIDTH,HEIGHT);
    // console.log(canvasRendererRef.current.elt);
    // console.log(parent);
    canvasRendererRef.current.parent(parent);
    // const canvasElt = canvasRendererRef.current.elt as HTMLCanvasElement;
    // console.log(canvasElt.isConnected);
    p5.noStroke();
    p5.background(backgroundImage);
    p5.loop();
  }, [canvasRendererRef]);

  const draw = useCallback((p5: p5) => {
    // p5.background(0);
    p5.fill(255);
    p5.rect(0, 0, 100, 100);
    // console.log("draw");
  }, []);


  return (
    <>
        <P5Sketch className={`the-sketch`} { ...{ preload, setup, draw } } width={`${WIDTH}`} height={`${HEIGHT}`} />
    </>
  )
};

export default EditorComponent;