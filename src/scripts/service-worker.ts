import { onNewTab } from "./content-newtab";

// This file is ran as a background script
console.log("Hello from background script!")
chrome.runtime.onInstalled.addListener(() => {
  console.log("Application installed!")
});

chrome.tabs.onCreated.addListener(async (tab) => {
  // tab.title = "Hello from background script!"
  console.log(`Tab created: ${tab.title}`)
  if (tab.title === "New Tab") {
    console.log("Injecting script file into new tab...");
    
    // // @ts-expect-error
    // await chrome.scripting
    //     .executeScript({
    //       target : {tabId : tab.id},
    //       files : [ "content-newtab.js" ],
    //     })
    //     .then(() => console.log("injected script file"));
  }
  // await chrome.scripting
  //     .insertCSS({
  //       target : {tabId : tab.id},
  //       files : [ "content.css" ],
  //     })
});