import React from 'react';
import {createHashHistory} from 'history';
import {Route, Router, Switch} from 'react-router-dom';
import AdminWrapper from './layouts/AdminWrapper';
import Login from './views/Login';

const hist = createHashHistory();

const App = (props) => {
    return (
        <Router history={hist}>
            <Switch>
                <Route
                    exact
                    path="/login"
                    render={(props) => <Login {...props} />}
                    key={'login'}
                />
                <Route
                    path="/"
                    render={(props) => <AdminWrapper {...props} />}
                    key="other"
                />
            </Switch>
        </Router>
    );
};

export default App;
