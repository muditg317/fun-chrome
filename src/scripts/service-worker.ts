// This file is ran as a background script
console.log("Hello from background script!")
chrome.runtime.onInstalled.addListener(() => {
  console.log("Application installed!")
});

chrome.tabs.onCreated.addListener((tab) => {
  // tab.title = "Hello from background script!"
  console.log(`Tab created: ${tab.title}`)
});