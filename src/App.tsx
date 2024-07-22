import { useEffect, useState } from 'react';
import { CheckInButton, Loading, Modal, Textarea, useToast, useModal } from './components';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { ToastContainer, addToast } = useToast();
  const { isOpen, openModal, closeModal } = useModal();
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const [exportData, setExportData] = useState('');

  return (
    <div className="flex justify-center items-center h-screen">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center">
          <CheckInButton addToast={addToast} openModal={openModal} setExportData={setExportData} />
        </div>
      )}
      <ToastContainer />
      <Modal isOpen={isOpen} onClose={closeModal} title={'导入数据'}>
        <Textarea
          defaultValue={exportData}
          onChange={(value) => {
            console.log(value.target.value);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;
