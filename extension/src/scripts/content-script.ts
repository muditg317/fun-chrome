// This file is injected as a content script
console.log("Hello from content script! - 5");



window.addEventListener("dblclick", (event) => {
  console.log("Double click event fired!");
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.left = `${event.clientX}px`;
  div.style.top = `${event.clientY}px`;
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.backgroundColor = "red";
  div.style.borderRadius = "25%";
  div.style.zIndex = Number.MAX_SAFE_INTEGER.toString();
  div.style.animation = "firework 1s ease-out forwards";
  div.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 1000);
});

window.addEventListener("click", event => {
  document.body.style.animation = "wobble 1s ease-out forwards";
  setTimeout(() => {
    document.body.style.animation = "unset";
  }, 1000);
});