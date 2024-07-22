export interface ToastOptions {
  text: string;
  duration?: number;
}

export type CheckInButtonProps = { addToast: ({ text, duration }: ToastOptions) => void };
