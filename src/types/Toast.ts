export interface ToastOptions {
  text: string;
  duration?: number;
}

export type CheckInButtonProps = {
  addToast: ({ text, duration }: ToastOptions) => void;
  openModal: () => void;
  setExportData: React.Dispatch<React.SetStateAction<string>>;
};
