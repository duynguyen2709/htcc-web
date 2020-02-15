import React from 'react';
import ReactDOM from 'react-dom';
import './assets/scss/index.scss';
import './assets/css/nucleo-icons.css';
import ReactNotification from 'react-notifications-component';
import App from './App';
import 'react-notifications-component/dist/theme.css';

ReactDOM.render(
  <div>
    <ReactNotification />
    <App />
  </div>,
  document.getElementById('root')
);
