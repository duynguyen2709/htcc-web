import axios from 'axios';
import {API_URL_EMPLOYEE} from '../constant/url';
import {TOKEN, USER} from '../constant/localStorageKey';

const getShiftArrangement = (year, week) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(
                `${API_URL_EMPLOYEE}/shifts/${user.companyId}/${year}/${week}`,
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

const deleteShiftArrangement = (type, arrangeId) => {
    const token = localStorage.getItem(TOKEN);

    return new Promise((resolve, reject) => {
        axios({
            method: 'delete',
            url: `${API_URL_EMPLOYEE}/shifts/${type}/${arrangeId}`,
            data: {},
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
//
// const configLikeHeadquarter = (officeId) => {
//     const token = localStorage.getItem(TOKEN);
//     const user = JSON.parse(localStorage.getItem(USER));
//
//     return new Promise((resolve, reject) => {
//         axios
//             .post(
//                 `${API_URL_EMPLOYEE}/shifttime/default/${user.companyId}/${officeId}`,
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                     timeout: 30000,
//                 }
//             )
//             .then((res) => {
//                 resolve(res.data);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// };
//
// const updateShiftTime = (data) => {
//     const token = localStorage.getItem(TOKEN);
//     const user = JSON.parse(localStorage.getItem(USER));
//
//     return new Promise((resolve, reject) => {
//         axios({
//             method: 'put',
//             url: `${API_URL_EMPLOYEE}/shifttime/${user.companyId}/${data.officeId}/${data.shiftId}`,
//             data: data,
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         })
//             .then((res) => {
//                 resolve(res.data);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// };
//
const createShiftArrangement = (data) => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    data.companyId = user.companyId;
    data.actor = user.username;

    if (data.type === 1) {
        data.arrangeDate = '';
    } else if (data.type === 2) {
        data.weekDay = 0;
    }

    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL_EMPLOYEE}/shifts`, data, {
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
    getShiftArrangement,
    createShiftArrangement,
    deleteShiftArrangement
};
