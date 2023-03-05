import React, { useCallback, useRef } from "react";

import p5 from "p5";
import P5Sketch from "~/components/p5-sketch";

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
};

const EditorComponent: React.FC<EditorProps> = ({ canvasRendererRef }: EditorProps) => {

  // const canvas = useRef<p5.Renderer>();

  const setup = useCallback((p5: p5) => {
    canvasRendererRef.current = p5.createCanvas(WIDTH,HEIGHT);
    console.log(canvasRendererRef.current);
    p5.noStroke();
  }, []);

  const draw = useCallback((p5: p5) => {
    p5.background(0);
    p5.fill(255);
    p5.rect(0, 0, 100, 100);

  }, []);


  return (
    <>
        <P5Sketch className={`the-sketch`} { ...{ setup, draw } } width={`${WIDTH}`} height={`${HEIGHT}`} />
    </>
  )
};

export default EditorComponent;