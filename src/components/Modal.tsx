import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  title?: React.ReactElement | string;
  children?: React.ReactElement;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDialogElement & { showModal: () => void }>(null);
  useEffect(() => {
    if (isOpen && modalRef?.current) {
      modalRef?.current.showModal();
    }
    const closeOnEscapeKey = (e: KeyboardEvent) => (e.key === 'Escape' ? onClose() : null);
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [onClose, isOpen, modalRef]);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <dialog id="my_modal_2" className="modal" ref={modalRef}>
      <div className="modal-box">
        <h2>{title}</h2>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button />
      </form>
    </dialog>,
    document.body
  );
};
