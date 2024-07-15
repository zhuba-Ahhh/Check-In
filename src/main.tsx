import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import './main.less';

import { RouterProvider } from 'react-router-dom';
import router from './router';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
