import axios from 'axios';
import {API_URL_EMPLOYEE} from '../constant/url';
import {TOKEN, USER} from '../constant/localStorageKey';

const getShiftTemplate = () => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(
                `${API_URL_EMPLOYEE}/shifttemplates/${user.companyId}`,
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

const deleteShiftTemplate = (templateId) => {
    const token = localStorage.getItem(TOKEN);

    return new Promise((resolve, reject) => {
        axios({
            method: 'delete',
            url: `${API_URL_EMPLOYEE}/shifttemplates/${templateId}`,
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

const createShiftTemplate = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    data.companyId = user.companyId;
    data.actor = `${user.fullName} (${user.username})`;

    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL_EMPLOYEE}/shifttemplates`, data, {
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
    getShiftTemplate ,
    deleteShiftTemplate,
    createShiftTemplate
};
