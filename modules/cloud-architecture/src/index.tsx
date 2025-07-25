import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import CloudArchitectureApp from './CloudArchitectureApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CloudArchitectureApp />
    </BrowserRouter>
  </React.StrictMode>
);
