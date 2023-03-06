import * as React from "react";
import logo from "../../assets/images/logo.svg";
import "./popup.css";

const isProd = process.env.NODE_ENV === "production" && false;
const HOST_NAME = isProd ? "https://webnote.mudit.tech" : "http://localhost:3000";

const popupApp = () => {
  console.log(HOST_NAME)
  return (
    <div className="popup">
      <header className="popup-header">
        <img src={logo} className="popup-logo" alt="logo" />
        <h1>Fun Chrome!</h1>
        <button className="captureButton" onClick={() => {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var tabTitle = tabs[0].title;
            chrome.windows.getCurrent(function(window) {
              chrome.tabs.captureVisibleTab(window.id, function(dataUrl) {
                let newURL = `${HOST_NAME}/editor?title=${tabTitle}&img=loadFromLocalStorage`;
                chrome.tabs.create(
                  {"url": newURL,active:false},(tab) => {
                      setTimeout(()=>{
                          chrome.tabs.sendMessage(tab.id!,dataUrl,(resp) => {
                            console.log("recieved");
                              chrome.tabs.update(tab.id!,{active: true});
                          });
                      },500);
                  }
                );
              });
            });
          });
        }}>Screenshot</button>
      </header>
      <main className="popup-main">

      </main>
    </div>
  );
};

export default popupApp;
