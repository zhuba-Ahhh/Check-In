import { useEffect, useState } from 'react';
import Loading from './components/Loading';
import CheckInButton from './components/CheckInButton';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center">
          <CheckInButton />
        </div>
      )}
    </div>
  );
}

export default App;
