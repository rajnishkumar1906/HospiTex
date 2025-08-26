// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './style.css';
import { PatientProvider } from '/src/context/PatientContext';
import { AppContextProvider } from './Auth/AppContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppContextProvider>
      <BrowserRouter>
        <PatientProvider>
          <App />
        </PatientProvider>
      </BrowserRouter>
    </AppContextProvider>
  </React.StrictMode>
);
