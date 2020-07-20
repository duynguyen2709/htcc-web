import React from 'react';
import '../App.css';
import {connect} from 'react-redux';
import {logout} from "../reducers/auth.reducer";
import {useHistory} from "react-router-dom";

const PermissionDenied = (props) => {
    let history = useHistory();
    const logout = () => {
        props.logout();
        history.push('/login');
    };
    return (<>
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>403</h1>
                </div>
                <h2>Bạn không có quyền truy cập</h2>
                <p>Vui lòng liên hệ quản lý để được cấp quyền.</p>
                {/*eslint-disable-next-line*/}
                <a href="#" onClick={() => logout()}>Đăng xuất</a>
            </div>
        </div>
    </>)
};

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(PermissionDenied);
