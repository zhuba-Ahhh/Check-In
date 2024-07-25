import JsonViewEditor, { JsonViewEditorProps } from '@uiw/react-json-view/editor';
import { ErrorBoundary } from './ErrorBoundary';

interface JsonViewEditorProp extends JsonViewEditorProps<object> {
  value: object;
  onEdit?: () => void;
}

export const JsonEditor = ({ value, onEdit }: JsonViewEditorProp) => {
  const onEditFn: JsonViewEditorProps<object>['onEdit'] = (option) => {
    console.log('======= option =======\n', option);
    onEdit && onEdit();
  };
  return (
    <ErrorBoundary>
      <JsonViewEditor value={value} onEdit={onEditFn} />
    </ErrorBoundary>
  );
};
