import { useEffect, useState } from 'react';
import {
  Loading,
  Modal,
  useToast,
  useModal,
  JsonEditor,
  ErrorBoundary,
  Textarea,
  Tabs,
} from './components';
import { CheckInButton } from './views';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { ToastContainer, addToast } = useToast();
  const { isOpen, openModal, closeModal } = useModal();
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const [exportData, setExportData] = useState<object>({});

  return (
    <ErrorBoundary>
      <div className="flex justify-center items-center h-screen">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col items-center">
            <CheckInButton
              addToast={addToast}
              openModal={openModal}
              setExportData={setExportData}
            />
          </div>
        )}
        <ToastContainer />
        <Modal isOpen={isOpen} onClose={closeModal} title={'导入数据'}>
          <Tabs
            tabs={[
              {
                key: 'JSON',
                label: 'JsonEditor',
                content: <JsonEditor defaultValue={exportData} />,
              },
              {
                key: 'Textarea',
                label: 'Textarea',
                content: (
                  <Textarea
                    defaultValue={JSON.stringify(exportData)}
                    onChange={(event) => {
                      console.log('======= event =======\n', event.target.value);
                    }}
                  />
                ),
              },
            ]}
          />
        </Modal>
      </div>
    </ErrorBoundary>
  );
}

export default App;
