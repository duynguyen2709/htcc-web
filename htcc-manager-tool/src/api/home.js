import axios from 'axios';
import {API_URL_EMPLOYEE} from '../constant/url';
import {TOKEN, USER} from '../constant/localStorageKey';

const getTotal = () => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(
                `${API_URL_EMPLOYEE}/home/manager/${user.companyId}/${user.username}`,
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
                reject('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
            });
    });
};

export default {
    getTotal,
};
