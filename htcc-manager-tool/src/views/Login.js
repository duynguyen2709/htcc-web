import React from 'react';

import FormLogin from '../components/Form/FormLogin';
import { Loader } from '../components/Loader';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckLogin: false
    };
  }

  componentDidMount() {}

  checkLogin = () => {
    this.setState({
      isCheckLogin: !this.state.isCheckLogin
    });
  };

  render() {
    const { isCheckLogin } = this.state;

    return (
      <div>
        {isCheckLogin && <Loader />}
        <div className="login-wrapper">
          <FormLogin checkLogin={this.checkLogin} />
        </div>
      </div>
    );
  }
}

export default Login;
