import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { TOKEN } from '../../constant/localStorageKey';
import { fetchUser } from '../../reducers/auth.reducer';

const AuthRequiredRoute = props => {
  const { user, children, fetchUser } = props;
  if (!user) {
    const token = localStorage.getItem(TOKEN);

    if (token) {
      fetchUser(token);
      return <div>Loadings</div>;
    } else {
      return <Redirect to="/login" />;
    }
  }

  return <React.Fragment>{children}</React.Fragment>;
};

const mapStateToProps = state => ({
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({
  fetchUser: token => dispatch(fetchUser(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthRequiredRoute);
