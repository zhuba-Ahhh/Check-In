import { useEffect, useState } from 'react';
import Loading from './components/Loading';
import CheckInButton from './components/CheckInButton';
import { useToast } from './components/useToast';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { ToastContainer, addToast } = useToast();
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
          <CheckInButton addToast={addToast}/>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
