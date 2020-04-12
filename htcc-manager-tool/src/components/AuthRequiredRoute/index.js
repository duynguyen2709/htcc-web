import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { TOKEN, USER } from '../../constant/localStorageKey';
import { fetchUser } from '../../reducers/auth.reducer';

const AuthRequiredRoute = props => {
  const { user, children, fetchUser, error } = props;
  if (error) {
    return <Redirect to="/login" />;
  }

  if (!user) {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));
    if (token && user) {
      fetchUser(user.companyId, user.username, token);
    } else {
      return <Redirect to="/login" />;
    }
  }

  return <React.Fragment>{children}</React.Fragment>;
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
  error: state.authReducer.error
});

const mapDispatchToProps = dispatch => ({
  fetchUser: (companyId, username, token) =>
    dispatch(fetchUser(companyId, username, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthRequiredRoute);
