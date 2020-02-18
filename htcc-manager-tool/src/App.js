import React from 'react';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import AdminLayout from './layouts/Admin';
import Login from './views/Login';

import './assets/scss/index.scss';
import './assets/css/nucleo-icons.css';

const hist = createBrowserHistory();

const App = () => {
  return (
    <Router history={hist}>
      <Switch>
        <Route exact path="/login" component={Login} key={'login'} />
        <Route path="/" render={props => <AdminLayout {...props} />} />
      </Switch>
    </Router>
  );
};

export default App;
