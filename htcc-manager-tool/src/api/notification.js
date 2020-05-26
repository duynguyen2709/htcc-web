import axios from 'axios';
import { API_URL_EMPLOYEE } from '../constant/url';
import { TOKEN, USER } from '../constant/localStorageKey';

const getNotifications = (date) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(
                `${API_URL_EMPLOYEE}/notifications/manager/${user.companyId}/${user.username}/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 20000,
                }
            )
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const createNoti = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    data['sender'] = user.username;
    data['companyId'] = user.companyId;

    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL_EMPLOYEE}/notifications/manager`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 30000,
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default {
    getNotifications,
    createNoti,
};
