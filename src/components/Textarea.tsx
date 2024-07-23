import React, { useEffect, useRef, useState } from 'react';

interface TextareaProps {
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}
export const Textarea = ({ defaultValue, onChange }: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState<string | number>('auto');

  useEffect(() => {
    if (textareaRef.current) {
      setHeight('auto');
      setHeight(textareaRef.current.scrollHeight);
    }
  }, [defaultValue]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      setHeight('auto');
      setHeight(textareaRef.current.scrollHeight);
    }
    onChange && onChange(event); // 调用传入的 onChange 处理函数，如果有的话
  };
  return (
    <textarea
      className="textarea textarea-bordered w-full mt-4 h-fit"
      ref={textareaRef}
      placeholder="Bio"
      defaultValue={defaultValue}
      onChange={handleChange}
      style={{ height }}
    />
  );
};
