import axios from 'axios';
import {API_URL_EMPLOYEE} from '../constant/url';
import {TOKEN, USER} from '../constant/localStorageKey';

const getRoles = () => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(
                `${API_URL_EMPLOYEE}/roles/${user.companyId}`,
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
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const deleteRole = (roleId) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios({
            method: 'delete',
            url: `${API_URL_EMPLOYEE}/roles/${user.companyId}/${roleId}`,
            data: {},
            headers: {
                Authorization: `Bearer ${token}`,
            },
            timeout: 30000,
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const createRole = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    data.companyId = user.companyId;

    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL_EMPLOYEE}/roles`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 30000,
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const updateRole = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    data.companyId = user.companyId;

    return new Promise((resolve, reject) => {
        axios
            .put(`${API_URL_EMPLOYEE}/roles/${user.companyId}/${data.roleId}`,
                data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 30000,
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

export default {
    getRoles ,
    deleteRole,
    createRole,
    updateRole,
};
