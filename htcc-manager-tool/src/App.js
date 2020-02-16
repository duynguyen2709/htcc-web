import React from 'react';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import AdminLayout from './layouts/Admin';
import './assets/scss/index.scss';
import './assets/css/nucleo-icons.css';

const hist = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Router history={hist}>
        <Switch>
          <Route
            path="/dashboard"
            render={props => <AdminLayout {...props} />}
          />
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </Router>
    );
  }
}

export default App;
