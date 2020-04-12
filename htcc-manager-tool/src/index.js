import React from 'react';
import ReactDOM from 'react-dom';
import './assets/scss/index.scss';
import './assets/css/nucleo-icons.css';
import ReactNotification from 'react-notifications-component';
import App from './App';
import 'react-notifications-component/dist/theme.css';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <ReactNotification />
    <App />
  </Provider>,
  document.getElementById('root')
);
