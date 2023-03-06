chrome.runtime.onMessage
    .addListener(function(message,sender,sendResponse) {
        addImagesToContainer(message);
        sendResponse("OK");
    });

function addImagesToContainer(imgData:any) {
    localStorage.setItem("imageFromExtension", imgData);
    console.log("save image");
}