import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './ErrorBoundary';

interface ModalProps {
  title?: React.ReactElement | string;
  children?: React.ReactElement;
  isOpen: boolean;
  onClose: () => void;
  onOk?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, isOpen, onClose, onOk }) => {
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
    <ErrorBoundary>
      <dialog id="my_modal_2" className="modal" ref={modalRef}>
        <div className="modal-box">
          <div className="mb-5">
            <h2>{title}</h2>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-4"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          {children}
          <div className="flex mt-5 justify-end">
            <button
              className="btn btn-outline btn-info w-full"
              onClick={() => {
                onOk && onOk();
                onClose();
              }}
            >
              确认
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button />
        </form>
      </dialog>
    </ErrorBoundary>,
    document.body
  );
};
