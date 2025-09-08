import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const ModalContext = createContext();

function Modal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const modalRef = useRef();
  return (
    <ModalContext.Provider value={{ modalRef, isOpen, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function ModalContent({ children, className }) {
  const { isOpen, close } = useContext(ModalContext);
  if (!isOpen) return null;
  return (
    <dialog className="modal modal-bottom sm:modal-middle" open={isOpen}>
      <div className={`modal-box ${className}`}>{children}</div>
      <div className="modal-backdrop">
        <button onClick={close}>close</button>
      </div>
    </dialog>
  );
}

function ModalAction({ children }) {
  return <div className="modal-action">{children}</div>;
}
function ModalClose({ children, className, submit }) {
  const { close } = useContext(ModalContext);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (submit) submit(e);
        close();
      }}
      className={className || "btn"}
    >
      {children || "Close"}
    </button>
  );
}

function OpenModel({ children, className }) {
  const { open } = useContext(ModalContext);
  return (
    <button className={className || "btn"} onClick={open}>
      {children}
    </button>
  );
}

Modal.ModalContent = ModalContent;
Modal.ModalAction = ModalAction;
Modal.OpenModel = OpenModel;
Modal.ModalClose = ModalClose;

export default Modal;
