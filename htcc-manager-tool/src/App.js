import React from 'react';
import {createHashHistory} from 'history';
import {Route, Router, Switch} from 'react-router-dom';
import AdminLayout from './layouts/Admin';
import Login from './views/Login';
import ReactLoading from "react-loading";
import {connect} from 'react-redux';

const hist = createHashHistory();

const App = (props) => {
    const {isLoadingHome} = props;
    if (isLoadingHome) {
        return <ReactLoading type={"spinningBubbles"}
                             color={"#4caf50"}
                             className={"center-div"}
                             height={'10%'}
                             width={'10%'}/>
    }
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
                    render={(props) => <AdminLayout {...props} />}
                    key="other"
                />
            </Switch>
        </Router>
    );
};

const mapStateToProps = (state) => ({
    isLoadingHome: state.homeReducer.isLoadingHome,
});

export default connect(mapStateToProps, null)(App);
