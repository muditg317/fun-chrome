/* eslint @typescript-eslint/no-unsafe-assignment: "warn" */
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import type p5 from "p5";

import DownloadIcon from "~/assets/downloadicon.svg";
import PenIcon from "~/assets/penicon.svg";
import HighlighterIcon from "~/assets/markericon.svg";
import EraserIcon from "~/assets/erasoricon.svg";
import Link from "next/link";

// import EditorComponent from "~/components/editor";
const EditorComponent = dynamic(() => import("~/components/editor"), { ssr: false });

// interface Tool {
//   icon: any,
//   name: string,
// };
const tools = [
  {
    icon: PenIcon,
    name: "pen",
  },
  {
    icon: HighlighterIcon,
    name: "highlighter",
  },
  {
    icon: EraserIcon,
    name: "eraser",
  },
] as const;

type Tool = typeof tools[number];

function postCanvasToURL(snap: p5.Renderer) {
  // Convert canvas image to Base64
  const blob = (snap.elt as HTMLCanvasElement).toBlob((blob) => {
    if (!blob) return;
    // let file = new File([blob], "fileName.jpg", { type: "image/jpeg" })
    
    const element = document.createElement('a');
    const url  = window.URL.createObjectURL(blob);
    element.setAttribute('href', url);
    element.setAttribute('download', "annotated.jpg");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

  }, 'image/jpeg');
  // var img = (snap.elt as HTMLCanvasElement).toDataURL();
  // console.log(img);
  
  // var element = document.createElement('a');
  // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(img));
  // element.setAttribute('download', "annotated.png");

  // element.style.display = 'none';
  // document.body.appendChild(element);

  // element.click();

  // document.body.removeChild(element);
}

const Editor: React.FC = () => {
  const canvasRef = useRef<p5.Renderer>();

  const [activeTool, setActiveTool] = useState<Tool>(tools[0]);

  return (
    <>
      <Head>
        <title>Web Note: Editor</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex items-center justify-between w-full px-4 py-4 bg-[#404348]">
        <Link className="flex items-center gap-4"
          href="/">
          {/* <Icon icon={EraserIcon} alt="Logo"/> */}
          <h1 className="text-2xl font-bold text-white">Web Note</h1>
        </Link>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-[#727780] rounded-md hover:bg-[#9498a0]"
            onClick={() => {
              postCanvasToURL(canvasRef.current!);
            }}
          >
            <span>Download</span>
            <Icon icon={DownloadIcon} alt="Download" />
          </button>
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#292B2E] relative">
        <div className="absolute top-6 left-6 bg-[#383C41] flex flex-col items-center rounded-md">
          {tools.map((tool, index) => (
            <Icon key={index} icon={tool.icon} alt={tool.name} size={23}
              className={`px-4 py-4 hover:bg-[#646c75] first:rounded-t-md last:rounded-b-md ${activeTool.name === tool.name ? "bg-[#646c75]" : ""}`}
              onClick={() => {
                setActiveTool(tool);
                // console.log(tool);
              }}
            />
          ))}
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <EditorComponent canvasRendererRef={canvasRef} activeTool={activeTool.name} />
        </div>
      </main>
    </>
  );
};

export default Editor;

interface IconProps {
  icon: any;
  alt: string;
  size?: number;
  className?: string;
  [key: string]: any;
}
function Icon({icon, alt, size=20, className, ...rest}: IconProps) {
  return (
    <div className={className} { ...rest }>
      <Image priority src={icon} alt={alt} width={size} height={size} />
    </div>
  );
}