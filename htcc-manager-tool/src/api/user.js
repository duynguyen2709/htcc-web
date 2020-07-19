import axios from 'axios';
import { API_URL_EMPLOYEE, API_URL_GATEWAY } from '../constant/url';
import { TOKEN, USER } from '../constant/localStorageKey';
import { authApi } from '.';

const getAllUsers = () => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(`${API_URL_EMPLOYEE}/users/${user.companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 30000,
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                debugger;
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const updatePassword = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    data['companyId'] = user.companyId;
    data['username'] = user.username;
    data['clientId'] = 2;

    return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            url: `${API_URL_GATEWAY}/api/gateway/private/changepassword/${data['clientId']}`,
            data: data,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const updateStatusAccount = (newStatus) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            url: `${authApi}/users/status/${user.companyId}/${user.username}/${newStatus}`,
            data: {},
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

export default {
    getAllUsers,
    updatePassword,
    updateStatusAccount,
};
