/* eslint @typescript-eslint/no-unsafe-assignment: "warn" */
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type p5 from "p5";
import {sha256} from "crypto-hash";

import DownloadIcon from "~/assets/downloadicon.svg";
import ShareIcon from "~/assets/shareicon.svg";
import CancelIcon from "~/assets/cancelicon.svg";
import PenIcon from "~/assets/penicon.svg";
import HighlighterIcon from "~/assets/markericon.svg";
import EraserIcon from "~/assets/erasoricon.svg";
import Link from "next/link";
import { type GetServerSideProps, type NextPage } from "next";

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

function shareCanvasData(canvasViewString: string) {
  // const currURL = new URL(window.location.href);
  // console.log(currURL.toString());

  // const imgData = canvas.toDataURL("image/jpeg", 0.1);
  // currURL.searchParams.set("img", imgData);

  console.log(canvasViewString);
  void navigator.clipboard.writeText(canvasViewString);
}
function saveCanvasToImg(canvas: HTMLCanvasElement) {
  canvas.toBlob((blob) => {
    if (!blob) return;    
    const element = document.createElement('a');
    const url  = window.URL.createObjectURL(blob);

    // console.log(url);

    element.setAttribute('href', url);
    element.setAttribute('download', "annotated.jpg");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

  }, 'image/jpeg');
}

type EditorProps = {
  host: string | null,
  title: string,
  img: string | null
}


export const getServerSideProps: GetServerSideProps<EditorProps> =
  context => Promise.resolve({ props: {
    host: !context.req.headers.host ? null : `${context.req.headers.referer ? (new URL(context.req.headers.referer)).protocol : "http://"}${context.req.headers.host}`,
    title: (context.query.title as string) || "Untitled",
    img: (context.query.img as string) || null,
  } });

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Editor: NextPage<EditorProps> = ({title, host: _host, img}: EditorProps) => {
  const canvasRef = useRef<p5.Renderer>();

  const host = _host || "http://fallback.com";

  const [defaultImageData, setDefaultImageData] = useState<string>("");

  const loadStoredData = useCallback((storedValue: string) => {
    // if (defaultImageData) return;
    // console.log("loadStoredData", storedValue);
    if (storedValue) {
      setDefaultImageData(storedValue);
      localStorage.removeItem("imageFromExtension");
    }
  }, []);

  useEffect(() => {
    const storageChangeHandler = (event: Event) => {
      console.log("storageChangeHandler", event);
      if (!(event instanceof StorageEvent)) return;
      if (!img || img !== "loadFromLocalStorage") return;
      if (event.key !== "imageFromExtension") return;
      if (!event.newValue) return;
      loadStoredData(event.newValue);
    }
    void delay(1000).then(() => {
      const currValue = localStorage.getItem("imageFromExtension");
      if (currValue) {
        console.log("found value without change handler");
        loadStoredData(currValue);
      } else {
        console.log("register storage listener");
        document.addEventListener("storage", storageChangeHandler);
      }
    });
    return () => {
      console.log("unregister storage listener");
      document.removeEventListener("storage", storageChangeHandler);
    }
  }, [img]);

  const [activeTool, setActiveTool] = useState<Tool>(tools[0]);
  const [showExportOption, setShowExportOption] = useState(false);
  const exportWrapperRef = useRef<HTMLDivElement>(null);

  const [shareLink, setShareLink] = useState<string>("");

  const updateShareLink = useCallback(async (canvas?: HTMLCanvasElement) => {
    const currURL = new URL(host);
    currURL.pathname = "/viewer";
    // console.log(currURL);
    if (!canvas) return currURL.toString();
    const imgData = canvas.toDataURL("image/jpeg", 0.5);
    const hashed = await sha256(imgData);
    currURL.searchParams.set("img", hashed);
    // console.log(currURL.toString());
    // return currURL.toString();
    setShareLink(currURL.toString());
  }, [host]);
  // console.log(`shareLink: |${shareLink}|`);

  useEffect(() => {
    const documentClickHandler = (event: Event) => {
      if (showExportOption && exportWrapperRef.current && !exportWrapperRef.current.contains(event.target as Node)) {
        setShowExportOption(false);
      }
    }
    document.addEventListener("click", documentClickHandler);
    return () => {
      document.removeEventListener("click", documentClickHandler);
    }
  }, [showExportOption]);

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
          <div className="relative" ref={exportWrapperRef}>
            <button className={`flex items-center gap-2 px-4 py-2 text-white bg-[#727780] rounded-t-md ${showExportOption ? "": "rounded-b-md"} hover:bg-[#9498a0]`}
              onClick={() => {
                setShowExportOption(prev => !prev);
                if (!showExportOption) {
                  void updateShareLink(canvasRef.current?.elt as HTMLCanvasElement);
                }
              }}
            >
              <span>Export</span>
              {/* <Icon icon={DownloadIcon} alt="Download" /> */}
            </button>
            {true && (
              <div className={`${showExportOption ? "block" : "hidden"} relative z-10`}>
                <div className="absolute top-0 right-0 flex flex-col gap-4 bg-[#818181] w-fit min-w-48 rounded-md rounded-tr-none shadow-md p-4">
                  <div className="flex flex-row justify-between">
                    <span className="flex flex-row gap-1">
                      <Icon icon={ShareIcon} alt="Share" />
                      <p className="text-white whitespace-nowrap text-ellipsis max-w-[20ex] overflow-hidden">{title ? `Share ${title}` : "Share"}</p>
                    </span>
                    <button className="text-white"
                      onClick={() => {
                        setShowExportOption(false);
                      }}
                    >
                      <Icon icon={CancelIcon} alt="Cancel export" size={15} />
                    </button>
                  </div>
                  <div className="flex flex-row gap-2">
                    <input className="text-white" name="share-link" id="share-link" value={`${shareLink}`} disabled></input>
                    <button className="flex items-center gap-2 px-2 py-2 text-white bg-[#727780] rounded-md hover:bg-[#9498a0]"
                      onClick={() => {
                        shareCanvasData(shareLink);
                      }}
                    >
                      <span>Copy</span>
                      {/* <Icon icon={CopyIcon} alt="Copy" /> */}
                    </button>
                  </div>
                  <button className="flex self-end items-center gap-2 px-4 py-2 w-fit text-white bg-[#727780] rounded-md hover:bg-[#9498a0]"
                    onClick={() => {
                      saveCanvasToImg(canvasRef.current!.elt as HTMLCanvasElement);
                    }}
                  >
                    <Icon icon={DownloadIcon} alt="Download" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
          {(defaultImageData || title==="Untitled") &&
            <EditorComponent canvasRendererRef={canvasRef} activeTool={activeTool.name} baseImage={defaultImageData} />
          }
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