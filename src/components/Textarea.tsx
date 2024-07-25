import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface TextareaProps {
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}
export const Textarea = ({ defaultValue, onChange }: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState<string | number>('auto');

  const setHeightFn = useCallback(() => {
    setHeight('auto');
    if (textareaRef?.current && textareaRef.current.scrollHeight) {
      setHeight(textareaRef.current.scrollHeight);
    }
  }, [textareaRef]);

  useEffect(() => {
    setHeightFn();
  }, [defaultValue, setHeightFn, textareaRef]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHeightFn();
    onChange && onChange(event); // 调用传入的 onChange 处理函数，如果有的话
  };

  return (
    <ErrorBoundary>
      <textarea
        className="textarea textarea-bordered w-full mt-4 h-fit"
        ref={textareaRef}
        placeholder="Bio"
        defaultValue={defaultValue}
        onChange={handleChange}
        style={{ height }}
      />
    </ErrorBoundary>
  );
};
