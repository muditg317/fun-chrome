import * as React from "react";
import logo from "../../assets/images/logo.svg";
import "./popup.css";

const popupApp = () => {
  return (
    <div className="popup">
      <header className="popup-header">
        <img src={logo} className="popup-logo" alt="logo" />
        <h1>Fun Chrome!</h1>
      </header>
      <main className="popup-main">

      </main>
    </div>
  );
};

export default popupApp;
