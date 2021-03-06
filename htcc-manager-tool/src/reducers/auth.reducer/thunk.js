import {authApi} from '../../api';
import {doLogin, doLoginFail, doLoginSuccess, doLogout} from './action';
import {doClearData} from '../home.reducer/action';
import {TOKEN, USER} from '../../constant/localStorageKey';

export const login = (companyId, username, password) => (dispatch) =>
    new Promise(async (resolve, reject) => {
        dispatch(doLogin(companyId, username, password));
        const res = await authApi.login(companyId, username, password);
        if (res.returnCode === 1) {
            localStorage.setItem(TOKEN, res.data.token);
            localStorage.setItem(USER, JSON.stringify(res.data.user));
            resolve(dispatch(doLoginSuccess(res.data.user)));
        } else {
            reject(dispatch(doLoginFail(res.returnMessage)));
        }
    });

export const fetchUser = (companyId, username, token) => (dispatch) =>
    new Promise(async (resolve, reject) => {
        let res = {};
        try {
            res = await authApi.fetchUser(companyId, username, token);
            if (res.returnCode === 1) {
                resolve(dispatch(doLoginSuccess(res.data)));
            } else {
                reject(dispatch(doLoginFail(res.returnMessage)));
            }
        } catch (err) {
            localStorage.removeItem(USER);
            localStorage.removeItem(TOKEN);
            reject(dispatch(doLoginFail('Auth fail')));
        }
    });

export const logout = () => async (dispatch) =>
    new Promise((resolve, reject) => {
        authApi.logout();
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(USER);
        dispatch(doLogout());
        dispatch(doClearData());
    });
