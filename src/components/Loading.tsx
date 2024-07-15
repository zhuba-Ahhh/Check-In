const Loading = () => {
  return (
    <div
      className="flex justify-center content-center min-h-screen"
      style={{ mask: 'linear-gradient(black, transparent)' }}
    >
      <span className="loading loading-spinner loading-lg" style={{ width: '3rem' }}></span>
    </div>
  );
};

export default Loading;
