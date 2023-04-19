import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Connection from './connection/Connection';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Connection/>}/>
          <Route path="/playground" element={<App/>}/>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
);
