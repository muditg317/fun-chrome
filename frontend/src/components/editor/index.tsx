import React, { useState, useCallback } from "react";
import Sketch from "polyfills/react-p5";
import type p5 from "p5";
import dummyImg from "assets/images/dummyImg.png";



const WIDTH = 500;
const HEIGHT = 500;
const INTERACTION_MARGIN = 5;
const INTERACTION_BOUNDS = [-INTERACTION_MARGIN, WIDTH+INTERACTION_MARGIN, -INTERACTION_MARGIN, HEIGHT+INTERACTION_MARGIN];

export default function Editor() {
  let backgroundImage: p5.Image;
  let mouseIsActive = false;

  //let startX: number, startY: number, endX: number, endY: number;

  let eraserIOn = false;
  let highligherIsOn = false;


  const eraserOn = (() => {
    eraserIOn = !eraserIOn;
  })

  const highligherOn = (() => {
    highligherIsOn = !highligherIsOn;
    console.log(highligherIsOn);
  })

  const preload = useCallback((p5: p5) => {
    backgroundImage = p5.loadImage(dummyImg);
  }, [])

  const setup = useCallback((p5: p5) => {
    p5.createCanvas(WIDTH,HEIGHT);
    p5.noStroke();
    p5.background(backgroundImage);
  }, []);

  const draw = useCallback((p5: p5) => {
    p5.stroke(0);
    p5.strokeWeight(5);
    if (mouseIsActive && highligherIsOn) {
      p5.stroke(255, 255, 0, 32);
      p5.strokeWeight(50);
      p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
      console.log("highlighter");
    } else if (mouseIsActive && eraserIOn) {
      console.log("eraser");
      p5.image(backgroundImage, p5.mouseX - 10, p5.mouseY - 10, 20, 20, (p5.mouseX - 10) / WIDTH * backgroundImage.width , (p5.mouseY - 10) / HEIGHT * backgroundImage.height, 20 / WIDTH * backgroundImage.width, 20 / HEIGHT * backgroundImage.height);
    } else if (mouseIsActive) {
      console.log("pen");
      p5.stroke(0,0,0,100);
      p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    }

  }, []);

  const mousePressed = (() => {
    mouseIsActive = true;
  })

  const mouseDragged = ((p5: p5) => {
    if (p5.mouseX < INTERACTION_BOUNDS[0] || p5.mouseX > INTERACTION_BOUNDS[1] || p5.mouseY < INTERACTION_BOUNDS[2] || p5.mouseY > INTERACTION_BOUNDS[3]) {
      mouseIsActive = false;
    }
  })

  const mouseReleased = (() => {
    mouseIsActive = false;
  })

  return (
    <div>
      <button onClick={eraserOn}>Eraser</button>
      <button onClick={highligherOn}>Highlighter</button>
      <Sketch className={`the-sketch`} { ...{ preload, setup, draw, mousePressed, mouseDragged, mouseReleased } } width={`${WIDTH}`} height={`${HEIGHT}`} />
    </div>
  );
}