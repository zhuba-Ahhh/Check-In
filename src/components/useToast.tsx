import { useState, useCallback } from 'react';
import Toast from './Toast';
import { ToastOptions } from '../types';

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastOptions & { id: number }>>([]);

  const addToast = useCallback(({ text, duration = 2000 }: ToastOptions) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, text, duration }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    ToastContainer: () => (
      <>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            text={toast.text}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </>
    ),
  };
};
