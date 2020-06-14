import axios from 'axios';
import {API_URL_EMPLOYEE} from '../constant/url';
import {TOKEN, USER} from '../constant/localStorageKey';

const getConfig = () => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(`${API_URL_EMPLOYEE}/dayoff/${user.companyId}`, {
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

const updateConfig = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            url: `${API_URL_EMPLOYEE}/dayoff/${user.companyId}`,
            data: data,
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
    getConfig,
    updateConfig,
};
