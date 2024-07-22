// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

interface TextareaProps {
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}
export const Textarea = ({ defaultValue, onChange }: TextareaProps) => {
  return (
    <textarea
      className="textarea textarea-bordered w-full mt-4 h-fit"
      placeholder="Bio"
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
};
