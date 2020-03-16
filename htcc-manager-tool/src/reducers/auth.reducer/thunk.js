import { authApi } from '../../api';
import { doLogin, doLoginFail, doLoginSuccess, doLogout } from './action';
import { TOKEN, USER } from '../../constant/localStorageKey';

export const login = (companyId, username, password) => dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch(doLogin(companyId, username, password));
    const res = await authApi.login(companyId, username, password);
    if (res.returnCode === 1) {
      const user = {
        companyId: res.data.user.companyId,
        username: res.data.user.username
      };
      localStorage.setItem(TOKEN, res.data.token);
      localStorage.setItem(USER, JSON.stringify(user));
      resolve(dispatch(doLoginSuccess(res.data.user)));
    } else {
      reject(dispatch(doLoginFail(res.returnMessage)));
    }
  });

export const fetchUser = (companyId, username, token) => dispatch =>
  new Promise(async (resolve, reject) => {
    const res = await authApi.fetchUser(companyId, username, token);

    if (res.returnCode === 1) {
      resolve(dispatch(doLoginSuccess(res.data.user)));
    } else {
      reject(dispatch(doLoginFail(res.returnMessage)));
    }
  });

export const logout = () => async dispatch =>
  new Promise(async (resolve, reject) => {
    const res = await authApi.logout();
    if (res.returnCode === 1) {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(USER);
      dispatch(doLogout());
    } else {
      reject(dispatch(doLoginFail(res.returnMessage)));
    }
  });
