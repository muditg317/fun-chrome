/* eslint @typescript-eslint/restrict-template-expressions: "warn" */
import React, { useCallback, useRef } from "react";

import type p5 from "p5";
import P5Sketch from "~/components/p5-sketch";
import dummyImg from "~/assets/dummyImg.png";
import useP5Event from "~/hooks/useP5Event";

const WIDTH = 500;
const HEIGHT = 500;
const INTERACTION_MARGIN = 5;
const INTERACTION_BOUNDS = [-INTERACTION_MARGIN, WIDTH+INTERACTION_MARGIN, -INTERACTION_MARGIN, HEIGHT+INTERACTION_MARGIN] as const;

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

const EditorComponent: React.FC<EditorProps> = ({ canvasRendererRef, activeTool }: EditorProps) => {
  const backgroundImageRef = useRef<p5.Image>();

  const preload = useCallback((p5: p5) => {
    backgroundImageRef.current = p5.loadImage(dummyImg.src);
  }, [])

  const setup = useCallback((p5: p5, parent: HTMLDivElement) => {
    canvasRendererRef.current = p5.createCanvas(WIDTH,HEIGHT);
    // console.log(canvasRendererRef.current.elt);
    // console.log(parent);
    canvasRendererRef.current.parent(parent);
    p5.noStroke();
    backgroundImageRef.current && p5.background(backgroundImageRef.current);
    p5.loop();
    // p5.blendMode(p5.LIGHTEST);
  }, [backgroundImageRef, canvasRendererRef]);

  const mouseDragged = useP5Event(useCallback((p5: p5) => {
    //console.log(activeTool, p5);
    switch (activeTool) {
      case "pen":
        p5.stroke(0);
        p5.strokeWeight(6);
        // p5.stroke(255, 0, 0, 255);
        // p5.strokeWeight(5);
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        // console.log(`draw pen line: ${p5.mouseX}, ${p5.mouseY}, ${p5.pmouseX}, ${p5.pmouseY}`);
        break;
      case "highlighter":
        p5.stroke(255, 255, 0, 32);
        p5.strokeWeight(30);
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        // console.log("highlighter");
        break;
      case "eraser":
        backgroundImageRef.current && p5.image(backgroundImageRef.current, p5.mouseX - 10, p5.mouseY - 10, 20, 20, (p5.mouseX - 10) / WIDTH * backgroundImageRef.current.width , (p5.mouseY - 10) / HEIGHT * backgroundImageRef.current.height, 20 / WIDTH * backgroundImageRef.current.width, 20 / HEIGHT * backgroundImageRef.current.height);
        // console.log("eraser");
        break;
      default:
        console.error(`Unknown tool: ${activeTool}`);
        break;
    }
  }, [activeTool]), INTERACTION_BOUNDS);

  const touchMoved = mouseDragged;

  return (
    <P5Sketch className={`the-sketch`} { ...{ preload, setup, mouseDragged, touchMoved } } width={`${WIDTH}`} height={`${HEIGHT}`} />
  );
};

export default EditorComponent;