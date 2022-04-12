import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "../app/store";
import "./Modal.css";

const Backdrop = (props) => {
  return <div className="backdrop"></div>;
};

const ModalOverlay = (props) => {
  return (
    <div className="modal">
      <div className="content">{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");
const Modal = (props) => {
  return (
    <Provider store={store}>
      {ReactDOM.createPortal(<Backdrop />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Provider>
  );
};

export default Modal;
