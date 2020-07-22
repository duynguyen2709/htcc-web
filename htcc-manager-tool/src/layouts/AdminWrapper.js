import React from "react";
import {connect} from 'react-redux';
import AdminLayout from './Admin';
import ReactLoading from "react-loading";
import PermissionDenied from "../views/PermissionDenied";
import {TOKEN, USER} from "../constant/localStorageKey";
import {fetchUser} from "../reducers/auth.reducer";
import * as _ from 'lodash';
import {Redirect} from "react-router-dom";

class AdminWrapper extends React.Component {

    isLogged = () => {
        const token = localStorage.getItem(TOKEN);
        const user = JSON.parse(localStorage.getItem(USER));

        if (!_.isEmpty(this.props.user)) {
            return true;
        }

        if (token && user) {
            this.props.fetchUser(user.companyId, user.username, token);
            return true;
        }

        return false;
    };

    render() {
        if (!this.isLogged()) {
            return <Redirect to={'/login'}/>
        }
        const {isLoadingHome, hasManagerRole} = this.props;
        if (!hasManagerRole) {
            return <PermissionDenied {...this.props}/>
        }

        if (isLoadingHome) {
            return <ReactLoading type={"spinningBubbles"}
                                 color={"#4caf50"}
                                 className={"center-div"}
                                 height={'10%'}
                                 width={'10%'}/>
        }

        return <AdminLayout {...this.props} />
    }
}

const mapStateToProps = (state) => ({
    isLoadingHome: state.homeReducer.isLoadingHome,
    hasManagerRole: state.authReducer.hasManagerRole,
    user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({
    fetchUser: (companyId, username, token) => dispatch(fetchUser(companyId, username, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminWrapper);
