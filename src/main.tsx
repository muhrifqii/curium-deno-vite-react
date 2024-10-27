import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { isDev } from './utils/env.ts';
import { Provider } from 'react-redux';
import { store } from './store.ts';

async function enableSwMock() {
  if (!isDev) {
    return;
  }
  const { worker } = await import('../mocks/browser.ts');
  return worker.start();
}

enableSwMock().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
});
