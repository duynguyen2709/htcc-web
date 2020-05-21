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
// const createShiftTime = (data) => {
//     const token = localStorage.getItem(TOKEN);
//     const user = JSON.parse(localStorage.getItem(USER));
//
//     data['companyId'] = user.companyId;
//
//     return new Promise((resolve, reject) => {
//         axios
//             .post(`${API_URL_EMPLOYEE}/shifttime`, data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 timeout: 30000,
//             })
//             .then((res) => {
//                 resolve(res.data);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// };
//

//
// const getListWorkingDay = (officeId, year) => {
//     const token = localStorage.getItem(TOKEN);
//     const user = JSON.parse(localStorage.getItem(USER));
//
//     return new Promise((resolve, reject) => {
//         axios
//             .get(
//                 `${API_URL_EMPLOYEE}/workingday/${user.companyId}/${officeId}/${year}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                     timeout: 20000,
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
// const deleteWorkingDay = (id) => {
//     const token = localStorage.getItem(TOKEN);
//
//     return new Promise((resolve, reject) => {
//         axios({
//             method: 'delete',
//             url: `${API_URL_EMPLOYEE}/workingday/${id}`,
//             data: {},
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
// const configWorkingDayLikeHeadquarter = (officeId) => {
//     const token = localStorage.getItem(TOKEN);
//     const user = JSON.parse(localStorage.getItem(USER));
//
//     return new Promise((resolve, reject) => {
//         axios
//             .post(
//                 `${API_URL_EMPLOYEE}/workingday/default/${user.companyId}/${officeId}`,
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
// const createWorkingDay = (data) => {
//     const token = localStorage.getItem(TOKEN);
//     const user = JSON.parse(localStorage.getItem(USER));
//
//     data['companyId'] = user.companyId;
//
//     return new Promise((resolve, reject) => {
//         axios
//             .post(`${API_URL_EMPLOYEE}/workingday`, data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 timeout: 30000,
//             })
//             .then((res) => {
//                 resolve(res.data);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// };
//
// const updateWorkingDay = (data) => {
//     const token = localStorage.getItem(TOKEN);
//     const user = JSON.parse(localStorage.getItem(USER));
//     data['companyId'] = user.companyId;
//
//     return new Promise((resolve, reject) => {
//         axios({
//             method: 'put',
//             url: `${API_URL_EMPLOYEE}/workingday/${data.id}`,
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

export default {
    getShiftArrangement,
    deleteShiftArrangement
};
