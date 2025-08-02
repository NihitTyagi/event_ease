import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // We will create this for Tailwind directives
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* The Provider component makes the Redux store available to any nested components */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
