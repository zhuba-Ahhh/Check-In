import { ErrorBoundary } from './ErrorBoundary';

export const Loading = () => {
  return (
    <ErrorBoundary>
      <div
        className="flex justify-center content-center min-h-screen"
        style={{ mask: 'linear-gradient(black, transparent)' }}
      >
        <span className="loading loading-spinner loading-lg" style={{ width: '3rem' }}></span>
      </div>
    </ErrorBoundary>
  );
};
