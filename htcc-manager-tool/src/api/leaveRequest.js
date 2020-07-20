import axios from 'axios';
import { API_URL_EMPLOYEE } from '../constant/url';
import { TOKEN, USER } from '../constant/localStorageKey';

const getList = (month) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(`${API_URL_EMPLOYEE}/leaving/${user.companyId}/${month}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 30000,
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

const updateStatus = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));
    data.approver = `${user.fullName} (${user.username})`;

    return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            url: `${API_URL_EMPLOYEE}/leaving/status`,
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

const createLeavingRequest = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    data['companyId'] = user.companyId;

    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL_EMPLOYEE}/leaving`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 30000,
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
    getList,
    updateStatus,
    createLeavingRequest,
};
