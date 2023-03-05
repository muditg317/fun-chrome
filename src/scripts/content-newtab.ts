export function onNewTab() {
  console.log("Hello from newtab script!");


  window.addEventListener("dblclick", (event) => {
    console.log("Double click event fired!");
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.left = `${event.clientX}px`;
    div.style.top = `${event.clientY}px`;
    div.style.width = "200px";
    div.style.height = "200px";
    div.style.backgroundColor = "red";
    div.style.borderRadius = "25%";
    div.style.zIndex = Number.MAX_SAFE_INTEGER.toString();
    div.style.animation = "firework 1s ease-out repeat";
    div.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(div);

    setTimeout(() => {
      div.remove();
    }, 2000);
  });
}

onNewTab();