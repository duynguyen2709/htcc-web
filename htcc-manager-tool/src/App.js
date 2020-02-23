import React from 'react';
import { createHashHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import AdminLayout from './layouts/Admin';
import Login from './views/Login';

import './assets/scss/index.scss';
import './assets/css/nucleo-icons.css';

const hist = createHashHistory();

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
