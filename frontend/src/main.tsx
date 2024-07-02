import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AuthContextProvider } from './context/AuthContext.tsx';
import { SwapsContextProvider } from './context/SwapsContext.tsx';
import { ModsContextsProvider } from './context/ModsContext.tsx';
import { SocketContextProvider } from './context/SocketContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <SwapsContextProvider>
          <ModsContextsProvider>
            <App />
          </ModsContextsProvider>
        </SwapsContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
