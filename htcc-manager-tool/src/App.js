import React from 'react';
import { createHashHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import AdminLayout from './layouts/Admin';
import Login from './views/Login';
import './App.css';

import './assets/scss/index.scss';
import './assets/css/nucleo-icons.css';

const hist = createHashHistory();

const App = () => {
  return (
    <Router history={hist}>
      <Switch>
        <Route
          exact
          path="/login"
          render={props => <Login {...props} />}
          key={'login'}
        />
        <Route
          path="/"
          render={props => <AdminLayout {...props} />}
          key="other"
        />
      </Switch>
    </Router>
  );
};

export default App;
