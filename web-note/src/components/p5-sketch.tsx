/* eslint @typescript-eslint/no-unsafe-argument: "warn", @typescript-eslint/no-unsafe-call: "warn" */
import React, { type MutableRefObject, useEffect, useRef } from 'react';
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

type CustomEventHandlers = {
  setup: (parent: HTMLDivElement) => void,
}

type P5EventRecord = Pick<p5, Exclude<EventNameType, keyof CustomEventHandlers>> & CustomEventHandlers;

type addP5Params<T> = T extends (...args: infer P) => void ? (p: p5, ...args: P) => void : unknown;
type WithP5Params<T> = {
  [K in keyof T]: addP5Params<T[K]>
}

type HandlerRecord = WithP5Params<P5EventRecord>;

type P5SketchProps = {
  width: `${number}`,
  height: `${number}`,
  id?: string,
  className?: string,
  style?: object,
} & Partial<HandlerRecord>;

type addPrefixToObject<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${K}` : string]: T[K]
}

type InternalP5EventRecord = addPrefixToObject<HandlerRecord, '_internal_'>;

type P5SketchRefType = p5 & Partial<InternalP5EventRecord>;

// function setEvent<T extends keyof HandlerRecord>(sketch: P5SketchRefType, event: T, handler: HandlerRecord[T]) {
//   sketch[`_internal_${event}`] = handler;
//   sketch[event] = (...args: Parameters<HandlerRecord[T]>) => {
//     if (event == "_internal_setup") {
//       if (sketch.canvas.parentElement) (args as unknown as Parameters<InternalP5EventRecord['_internal_setup']>)[1] = sketch.canvas.parentElement;
//     }
//     (handler as unknown as any)?.(sketch, ...(args as any));
//   };
// }

export default function P5Sketch(props: P5SketchProps) {
  const {
    width,
    height,
    id,
    className = "react-p5",
    style,
    ...events
  } = props;

  const canvasParentRef = useRef<HTMLDivElement>();
  const sketchRef = useRef<P5SketchRefType>();
  // const handlerCache = useRef<Partial<HandlerRecord>>({});

  useEffect(() => {
    if (!sketchRef.current) {
      // console.log('create new sketch');
      sketchRef.current = new p5((p: P5SketchRefType) => {
        // console.log(events);
        p5Events.forEach((event) => {
          if (events[event]) {
            (p[`_internal_${event}`] as any) = events[event];
            p[event] = (...args: Parameters<P5EventRecord[typeof event]>) => {
              if (event == "setup") {
                if (canvasParentRef.current) (args as unknown as Parameters<InternalP5EventRecord['_internal_setup']>)[1] = canvasParentRef.current;
              }
              (p[`_internal_${event}`] as unknown as any)?.(p, ...(args as any));
            };
          }
        });
      }, canvasParentRef.current);
    } else {
      // console.log('update sketch');
      p5Events.forEach((event) => {
        if (events[event] && events[event] !== sketchRef.current?.[`_internal_${event}`]) {
          // console.log(event,"changed");
          if (sketchRef.current) (sketchRef.current[`_internal_${event}`] as any) = events[event];
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
}