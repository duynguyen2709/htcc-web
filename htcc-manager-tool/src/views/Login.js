import React from 'react';
import FormLogin from '../components/Form/FormLogin';
import { Loader } from '../components/Loader';
import * as _ from 'lodash';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUser } from '../reducers/auth.reducer';
import { TOKEN } from '../constant/localStorageKey';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingData: false
    };
  }

  isLogged = () => {
    const token = localStorage.getItem(TOKEN);
    if (!_.isEmpty(this.props.user)) {
      return true;
    }

    if (token) {
      fetchUser(token);
      return true;
    }

    return false;
  };

  checkLogin = () => {
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
      <div>
        {isLoadingData && <Loader />}
        <div className="login-wrapper">
          <FormLogin checkLogin={this.checkLogin} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({
  fetchUser: token => dispatch(fetchUser(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
