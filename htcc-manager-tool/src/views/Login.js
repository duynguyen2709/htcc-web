import React from 'react';
import FormLogin from '../components/Form/FormLogin';
import {Loader} from '../components/Loader';
import * as _ from 'lodash';
import {Button} from "antd";
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchUser} from '../reducers/auth.reducer';
import {TOKEN, USER} from '../constant/localStorageKey';
import FormPayment from "../components/Form/FormPayment";
import FormForgotPassword from "../components/Form/FormForgotPassword";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadingData: false,
            currentMode: 0,
        };
    }

    toggleMode = (mode) => {
        this.setState({
            currentMode: mode
        })
    };

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

    toggleLoader = () => {
        this.setState({
            isLoadingData: !this.state.isLoadingData
        });
    };

    render() {
        const {isLoadingData, currentMode} = this.state;

        if (this.isLogged()) {
            return <Redirect to="/thong-ke"/>;
        }

        return (
            <div className="bg-dark">
                {isLoadingData && <Loader/>}
                <div className="login-wrapper">
                    {currentMode === 0 ?
                        <>
                            <FormLogin toggleLoader={this.toggleLoader}/>
                            <div style={{display: 'flex', flexDirection: 'row', float: 'right'}}>
                                <Button type="link" style={{marginRight: '200px'}}
                                        onClick={() => this.toggleMode(1)}
                                >
                                    Quên mật khẩu ?
                                </Button>
                                <Button type="link" style={{float: 'right'}}
                                        onClick={() => this.toggleMode(2)}
                                >
                                    Thanh toán hóa đơn
                                </Button>
                            </div>
                        </>
                        : null}
                    {currentMode === 1 ?
                        <>
                            <FormForgotPassword toggleLoader={this.toggleLoader}/>
                            <Button type="link" style={{float: 'right'}}
                                    onClick={() => this.toggleMode(0)}
                            >
                                Đăng nhập
                            </Button>
                        </>
                        : null}
                    {currentMode === 2 ?
                        <>
                            <FormPayment toggleLoader={this.toggleLoader}/>
                            <Button type="link" style={{float: 'right'}}
                                    onClick={() => this.toggleMode(0)}
                            >
                                Đăng nhập
                            </Button>
                        </>
                        : null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({
    fetchUser: (companyId, username, token) => dispatch(fetchUser(companyId, username, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
