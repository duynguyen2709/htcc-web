import React from 'react';
import FormLogin from '../components/Form/FormLogin';
import { Loader } from '../components/Loader';
import * as _ from 'lodash';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUser } from '../reducers/auth.reducer';
import { TOKEN, USER } from '../constant/localStorageKey';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingData: false
    };
  }

  isLogged = () => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    if (!_.isEmpty(this.props.user)) {
      return true;
    }

    if (token && user) {
      fetchUser(user.companyId, user.username, token);
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
    const { isLoadingData } = this.state;

    if (this.isLogged()) {
      return <Redirect to="/thong-ke" />;
    }

    return (
      <div className="bg-dark">
        {isLoadingData && <Loader />}
        <div className="login-wrapper">
          <FormLogin toggleLoader={this.toggleLoader} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({
  fetchUser: (companyId, username, token) =>
    dispatch(fetchUser(companyId, username, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
