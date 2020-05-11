import React from 'react';
import ReactDOM from 'react-dom';
import './assets/scss/index.scss';
import './assets/css/nucleo-icons.css';
import ReactNotification from 'react-notifications-component';
import App from './App';
import 'react-notifications-component/dist/theme.css';
import { Provider } from 'react-redux';
import store from './store';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale-provider/vi_VN';
import 'moment/locale/vi';

ReactDOM.render(
    <Provider store={store}>
        <ReactNotification />
        <ConfigProvider locale={viVN}>
            <App />
        </ConfigProvider>
    </Provider>,
    document.getElementById('root')
);
