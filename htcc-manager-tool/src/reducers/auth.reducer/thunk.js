import { authApi } from '../../api';
import { doLogin, doLoginFail, doLoginSuccess, doLogout } from './action';
import { TOKEN } from '../../constant/localStorageKey';

export const login = (companyId, userId, password) => dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch(doLogin(companyId, userId, password));
    const res = await authApi.login(companyId, userId, password);
    if (res.returnCode === 1) {
      localStorage.setItem(TOKEN, res.data.token);
      resolve(dispatch(doLoginSuccess(res.data.user)));
    } else {
      reject(dispatch(doLoginFail(res.returnMessage)));
    }
  });

export const fetchUser = token => dispatch =>
  new Promise(async (resolve, reject) => {
    const res = await authApi.fetchUser(token);
    console.log('res', res);
    if (res.returnCode === 1) {
      localStorage.setItem(TOKEN, res.data.token);
      resolve(dispatch(doLoginSuccess(res.data.user)));
    } else {
      reject(dispatch(doLoginFail(res.returnMessage)));
    }
  });

export const logout = () => async dispatch => {
  dispatch(doLogout());
  localStorage.removeItem(TOKEN);
};
