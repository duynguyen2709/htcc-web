import axios from 'axios';
import {API_URL_EMPLOYEE} from '../constant/url';
import {TOKEN} from '../constant/localStorageKey';

const getAllUsers = () => {
    const token = localStorage.getItem(TOKEN);
    return new Promise((resolve, reject) => {
        axios
            .get(`${API_URL_EMPLOYEE}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 30000
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

export default {
    getAllUsers
};
