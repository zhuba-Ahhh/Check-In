/* eslint-disable react/prop-types */
import { ReactElement, PropsWithChildren } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function Fallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

interface ErrorBoundaryProps {
  fallback?: ReactElement;
}

export const ErrorBoundary: React.FC<PropsWithChildren<ErrorBoundaryProps>> = ({
  children,
  fallback,
}) => (
  <ReactErrorBoundary fallbackRender={fallback ? () => fallback : Fallback}>
    {children}
  </ReactErrorBoundary>
);
