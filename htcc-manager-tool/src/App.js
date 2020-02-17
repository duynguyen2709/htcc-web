import React from 'react';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import AdminLayout from './layouts/Admin';
import Login from './views/Login';

import './assets/scss/index.scss';
import './assets/css/nucleo-icons.css';

const hist = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Router history={hist}>
        <Switch>
          <Route
            exact
            path="/dashboard"
            render={props => <AdminLayout {...props} />}
          />
          <Route exact path="/login" component={Login} key={'login'} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    );
  }
}

export default App;
