import axios from 'axios';
import { API_URL_EMPLOYEE } from '../constant/url';
import { TOKEN, USER } from '../constant/localStorageKey';

const getListApprovedCheckin = (yyyyMM) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(
                `${API_URL_EMPLOYEE}/checkin/manager/${user.companyId}/${yyyyMM}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 30000,
                }
            )
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const getListPendingCheckin = (yyyyMM) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(
                `${API_URL_EMPLOYEE}/checkin/manager/pending/${user.companyId}/${yyyyMM}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 30000,
                }
            )
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const createCheckinRequest = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    data['companyId'] = user.companyId;

    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL_EMPLOYEE}/checkin/manager`, data, {
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

const updateStatusCheckinRequest = (data) => {
    const token = localStorage.getItem(TOKEN);

    return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            url: `${API_URL_EMPLOYEE}/checkin/status`,
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

export default {
    getListApprovedCheckin,
    getListPendingCheckin,
    createCheckinRequest,
    updateStatusCheckinRequest,
};
