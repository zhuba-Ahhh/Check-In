import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ToastProps {
  text: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ text, duration = 2000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return ReactDOM.createPortal(
    <div className="toast toast-top toast-center">
      <div className="alert alert-success flex">{text}</div>
    </div>,
    document.body
  );
};
