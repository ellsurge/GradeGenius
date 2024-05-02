import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import store from "./store/store";
import { fetcher } from "./_services";

const root = ReactDOM.createRoot(document.getElementById('root'));
fetcher("hello");
root.render(
  <Provider store={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>
);
