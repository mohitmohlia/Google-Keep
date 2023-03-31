import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: React.ReactNode;
  show: boolean;
  isEdit: boolean;
  resource: string;
  onClose: () => void;
};
const Modal = ({ show, children, isEdit, resource, onClose }: ModalProps) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const ref = useRef<Element | null>(null);
  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#modal-root");
    setMounted(true);
  }, []);

  function handleModalClose(e: React.SyntheticEvent) {
    e.preventDefault();
    onClose();
  }

  useEffect(() => {
    function closeModal(e: KeyboardEvent) {
      if (e.code === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", closeModal);
    return () => document.removeEventListener("keydown", closeModal);
  }, [onClose]);

  const modalContent = show ? (
    <div
      className="modal overlay absolute  top-0 left-0 flex h-full w-full items-center justify-center bg-transparent/80"
      onClick={handleModalClose}
    >
      <div
        className="modal  rounded-xl bg-zinc-800"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className="modal heading m-4 flex h-16 items-start justify-between text-3xl text-zinc-300">
          <span className="p-4 text-zinc-300">
            {isEdit ? "Edit" : "Add"} {resource}
          </span>
          <span className="p-4">
            <a href="#" onClick={handleModalClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-x"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </a>
          </span>
        </div>
        {children}
      </div>
    </div>
  ) : null;
  if (mounted && ref.current) {
    return createPortal(modalContent, ref.current);
  } else {
    return null;
  }
};

export default Modal;
