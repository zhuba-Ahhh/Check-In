import { useCallback, useEffect, useState } from 'react';
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
import { setLocalStorage } from './utils';

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

  const onOk = useCallback(() => {
    setLocalStorage(`weekData`, JSON.stringify(exportData));
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({ text: '导入成功' });
    }, 1000);
  }, [addToast, exportData]);

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
        <Modal isOpen={isOpen} onClose={closeModal} title={'导入数据'} onOk={onOk}>
          <Tabs
            tabs={[
              {
                key: 'Textarea',
                label: 'Textarea',
                content: (
                  <Textarea
                    defaultValue={JSON.stringify(exportData)}
                    onChange={(event) => {
                      try {
                        setExportData(JSON.parse(event.target.value));
                      } catch (error) {
                        /* empty */
                      }
                    }}
                  />
                ),
              },
              {
                key: 'JSON',
                label: 'JsonEditor',
                content: <JsonEditor value={exportData} />,
              },
            ]}
          />
        </Modal>
      </div>
    </ErrorBoundary>
  );
}

export default App;
