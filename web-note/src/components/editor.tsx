import React, { useCallback, useMemo, useRef, useState } from "react";

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

  const [mouseIsActive, setMouseIsActive] = useState(false);

  //let startX: number, startY: number, endX: number, endY: number;

  const penIsOn = useMemo(() => activeTool === "pen", [activeTool]);
  const eraserIsOn = useMemo(() => activeTool === "eraser", [activeTool]);
  const highligherIsOn = useMemo(() => activeTool === "highlighter", [activeTool]);

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
    p5.noLoop();
    p5.blendMode(p5.LIGHTEST);
  }, [backgroundImageRef, canvasRendererRef]);

  const draw = useCallback((p5: p5) => {
    // console.log("draw");
    // p5.stroke(0);
    // p5.strokeWeight(5);
    // if (mouseIsActive && highligherIsOn) {
    //   p5.stroke(255, 255, 0, 32);
    //   p5.strokeWeight(30);
    //   p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    //   console.log("highlighter");
    // } else if (mouseIsActive && eraserIsOn) {
    //   console.log("eraser");
    //   backgroundImageRef.current && p5.image(backgroundImageRef.current, p5.mouseX - 10, p5.mouseY - 10, 20, 20, (p5.mouseX - 10) / WIDTH * backgroundImageRef.current.width , (p5.mouseY - 10) / HEIGHT * backgroundImageRef.current.height, 20 / WIDTH * backgroundImageRef.current.width, 20 / HEIGHT * backgroundImageRef.current.height);
    // } else if (mouseIsActive && penIsOn) {
    //   console.log("pen");
    //   p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    // }
  }, [mouseIsActive, penIsOn, eraserIsOn, highligherIsOn]);

  const mousePressed = useP5Event(useCallback(() => {
    setMouseIsActive(true);
  }, [setMouseIsActive]), INTERACTION_BOUNDS);

  const mouseDragged = useP5Event(useCallback((p5: p5) => {
    setMouseIsActive(true);
    //console.log(activeTool, p5);
    switch (activeTool) {
      case "pen":
        p5.stroke(0);
        p5.strokeWeight(5);
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        console.log("pen");
        break;
      case "highlighter":
        p5.stroke(255, 255, 0, 32);
        p5.strokeWeight(30);
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        console.log("highlighter");
        break;
      case "eraser":
        backgroundImageRef.current && p5.image(backgroundImageRef.current, p5.mouseX - 10, p5.mouseY - 10, 20, 20, (p5.mouseX - 10) / WIDTH * backgroundImageRef.current.width , (p5.mouseY - 10) / HEIGHT * backgroundImageRef.current.height, 20 / WIDTH * backgroundImageRef.current.width, 20 / HEIGHT * backgroundImageRef.current.height);
        console.log("eraser");
        break;
      default:
        console.error(`Unknown tool: ${activeTool}`);
        break;
    }
  }, [activeTool, setMouseIsActive]), INTERACTION_BOUNDS);

  const mouseReleased = useCallback(() => {
      setMouseIsActive(false);
  }, [setMouseIsActive]);

  return (
    <P5Sketch className={`the-sketch`} { ...{ preload, setup, draw, mousePressed, mouseDragged, mouseReleased } } width={`${WIDTH}`} height={`${HEIGHT}`} />
  );
};

export default EditorComponent;