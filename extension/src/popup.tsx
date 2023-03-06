import * as React from "react";
import * as ReactDOM from "react-dom";

import Popup from "./components/popup-main";
import "./index.css"

const mountNode = document.getElementById("popup");
ReactDOM.render(<Popup/>, mountNode);