import JsonViewEditor from '@uiw/react-json-view/editor';
import { ErrorBoundary } from './ErrorBoundary';

type JsonEditorProps = {
  defaultValue: object;
};
export const JsonEditor = ({ defaultValue }: JsonEditorProps) => {
  return (
    <ErrorBoundary>
      <JsonViewEditor value={defaultValue} />
    </ErrorBoundary>
  );
};
