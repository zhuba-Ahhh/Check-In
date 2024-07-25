import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './ErrorBoundary';

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
    <ErrorBoundary>
      <div className="toast toast-top toast-center">
        <div className="alert alert-success flex">{text}</div>
      </div>
    </ErrorBoundary>,
    document.body
  );
};
