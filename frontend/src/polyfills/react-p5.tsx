import React, { MutableRefObject, useEffect, useRef } from 'react';
import p5 from 'p5';

const p5Events = [
  "setup",
  "draw",
  "windowResized",
  "preload",
  "mouseClicked",
  "doubleClicked",
  "mouseMoved",
  "mousePressed",
  "mouseWheel",
  "mouseDragged",
  "mouseReleased",
  "keyPressed",
  "keyReleased",
  "keyTyped",
  "touchStarted",
  "touchMoved",
  "touchEnded",
  "deviceMoved",
  "deviceTurned",
  "deviceShaken",
] as const;

type EventNameType = typeof p5Events[number];

type EventHandler = (p5: p5, ...args: any[]) => void;

type SketchProps = {
  width: `${number}`,
  height: `${number}`,
  id?: string,
  className?: string,
  style?: Object,
} & Partial<Record<EventNameType, EventHandler>>;

type InternalEventName = `_internal_${EventNameType}`;

type SketchRefType = p5 & Partial<Record<InternalEventName, EventHandler>>;

export default function Sketch(props: SketchProps) {
  const {
    width,
    height,
    id,
    className = "react-p5",
    style,
    ...events
  } = props;

  const canvasParentRef = useRef<HTMLDivElement>();
  const sketchRef = useRef<SketchRefType>();

  useEffect(() => {
    if (!sketchRef.current) {
      console.log('create new sketch', events);
      sketchRef.current = new p5(p => {
        // console.log(events);
        p5Events.forEach((event) => {
          if (events[event]) {
            p[`_internal_${event}`] = events[event];
            p[event] = (...args: any[]) => {
              // console.log(`run ${event} within p5`);
              // console.log(p[`_internal_${event}`])
              p[`_internal_${event}`](p, ...args);
            };
          }
        });
      }, canvasParentRef.current);
    } else {
      // console.log('update sketch', events);
      p5Events.forEach((event) => {
        if (events[event] && events[event] !== sketchRef.current![`_internal_${event}`]) {
          // console.log(event,"changed");
          sketchRef.current![`_internal_${event}`] = events[event];
        }
      });
    }
  }, [events]);

  useEffect(() => {
    return () => {
      sketchRef.current?.remove();
    }
  }, []);

  return <div
      ref={canvasParentRef as MutableRefObject<HTMLDivElement>}
      { ...{
        width,
        height,
        id,
        className,
        style
      }}
    />;
};